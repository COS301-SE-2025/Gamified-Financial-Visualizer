// GameBoardViewer.jsx
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, useGLTF, useProgress, AdaptiveDpr, Preload, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import BoardTileModal from "./BoardTileModal"
import { BOARD_TILES, BOARD_ORDER } from "../../components/game/data/boardTiles"
import { FaDice } from "react-icons/fa"

// Preload models
useGLTF.preload("/game/Monopoly_Game.glb")
useGLTF.preload("/game/Monopoly_Characters.glb")

/* ------------ Loader ------------ */
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="px-4 py-2 rounded-xl bg-white/95 border border-gray-200 text-sm text-gray-700 shadow-lg">
        Loading… {Math.round(progress)}%
      </div>
    </Html>
  )
}

/* ------------ Renderer tuning ------------ */
function RendererTuning({ exposure = 1.1 }) {
  const { gl } = useThree()
  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = exposure
    if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl, exposure])
  return null
}

/* ------------ Lights ------------ */
function BoardRig() {
  return (
    <>
      <hemisphereLight skyColor={"#fff4e6"} groundColor={"#d9c3a8"} intensity={0.6} />
      <directionalLight
        color={"#FFD4B8"}
        position={[50, 100, 50]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0005}
        shadow-normalBias={0.5}
      />
      <directionalLight color={"#BFD8FF"} position={[-50, 30, -30]} intensity={0.9} />
      <ambientLight intensity={0.15} />
    </>
  )
}

/* ------------ Board model ------------ */
function BoardModel({ src, onReady }) {
  const gltf = useGLTF(src)

  useEffect(() => {
    const scene = gltf.scene
    if (!scene) return

    // Lighting/material defaults
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (!m) return
          m.metalness = 0
          m.roughness = 0.5
          m.envMapIntensity = 0
        })
      }
    })

    // Center the whole board at origin
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)

    // Surface Y (~top of the board) plus a hair to avoid z-fighting
    const surfaceY = box.max.y - center.y + 0.01

    // Collect meshes we should raycast against (prefer the flat board parts)
    const allMeshes = []
    scene.traverse((o) => { if (o.isMesh) allMeshes.push(o) })

    // Heuristic: keep "flat-ish" surfaces (the board) and drop tall props (trees, stacks, dice)
    const flatMeshes = allMeshes.filter((m) => {
      const b = new THREE.Box3().setFromObject(m)
      const h = b.max.y - b.min.y
      // names can help too
      const name = (m.name || '').toLowerCase()
      const likelyProp = /(tree|dice|coin|stack|bench|note|money)/i.test(name)
      return !likelyProp && h < 0.6
    })

    onReady?.({
      surfaceY,
      meshes: flatMeshes.length ? flatMeshes : allMeshes, // fallback
      bounds: box,
      center,
    })
  }, [gltf, onReady])

  // IMPORTANT: keep the board un-rotated so it reads straight
  return (
    <group rotation={[0, 0, 0]} scale={1}>
      <primitive object={gltf.scene} />
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Character Pawn (mesh picker + animation player)
   - Shows ONLY the chosen character subtree
   - Plays "Idle" / "Walk" (with fuzzy fallback on clip names)
   - Exposes its group ref so MovementController can move it
──────────────────────────────────────────────────────────────────────────── */
const norm = (s = "") => s.toLowerCase().replace(/[\s_.-]+/g, "").trim()

const CharacterPawn = React.forwardRef(function CharacterPawn(
  {
    src = "/game/Monopoly_Characters.glb",
    focus = "Cowboy",            // e.g. 'Cowboy', 'Ninja.001'
    play = "Idle",               // animation name to play
    position = [0, 0.02, 0],
    scale = 1,
    rotationY = 0,
  },
  ref
) {
  const outer = useRef()
  const inner = useRef()
  const { scene, animations } = useGLTF(src)
  const { actions, clips } = useAnimations(animations, outer)

  // choose subtree by name (similar to CharacterSelectViewer)
  const chosen = useMemo(() => {
    const container =
      scene?.children?.length === 1 && scene.children[0]?.children?.length
        ? scene.children[0]
        : scene
    const kids = []
    container?.children?.forEach((c) => {
      let hasMesh = false
      c.traverse((n) => { if (n.isMesh) hasMesh = true })
      if (hasMesh) kids.push(c)
    })
    if (!kids.length) return container
    const want = norm(focus)
    return (
      kids.find((k) => norm(k.name) === want) ||
      kids.find((k) => norm(k.name).includes(want)) ||
      kids[0]
    )
  }, [scene, focus])

  // show only the chosen character subtree
  useEffect(() => {
    if (!scene || !inner.current) return
    const container =
      scene?.children?.length === 1 && scene.children[0]?.children?.length
        ? scene.children[0]
        : scene

    container.children.forEach((c) => (c.visible = c === chosen))

    // Put the chosen subtree under the inner group
    inner.current.clear()
    if (chosen) inner.current.add(chosen)

    // Reset any prior offset then compute a fresh bbox
    inner.current.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(inner.current)
    const yOffset = -box.min.y        // lift down to touch y=0
    inner.current.position.y += yOffset

    // optional: shrink slightly if too tall
    // inner.current.scale.setScalar(0.95)
  }, [scene, chosen])

  // neutralize materials & shadows
  useEffect(() => {
    scene?.traverse?.((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (!m) return
          m.metalness = 0
          m.roughness = 0.5
          m.envMapIntensity = 0
        })
      }
    })
  }, [scene])

  // pick an animation by fuzzy name (Idle/Walk fallbacks)
  const pickClipName = (want) => {
    if (!clips?.length) return null
    const w = norm(want)
    return (
      clips.find((c) => norm(c.name) === w)?.name ||
      clips.find((c) => norm(c.name).includes(w))?.name ||
      // sensible fallbacks
      (w === "walk" && (clips.find((c) => /walk|run|move/i.test(c.name))?.name)) ||
      (w === "idle" && (clips.find((c) => /idle|stand/i.test(c.name))?.name)) ||
      clips[0].name
    )
  }

  // play / cross-fade animation
  useEffect(() => {
    const name = pickClipName(play)
    if (!name || !actions) return

    const act = actions[name]
    if (!act) return

    act.reset().fadeIn(0.25).play()
    return () => {
      const a = actions && actions[name]
      if (a && a.enabled) {
        try { a.fadeOut(0.25) } catch { }
      }
    }
  }, [actions, play])


  // expose ref to parent (MovementController moves this group)
  useEffect(() => {
    if (!ref) return
    if (typeof ref === "function") ref(outer.current)
    else ref.current = outer.current
  }, [ref])

  return (
    <group ref={outer} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* inner is what we ground-align to y=0 */}
      <group ref={inner} />
    </group>
  )
})

/* ------------ Path positions (square loop) ------------ */
function useBoardPath(count = BOARD_ORDER.length, radius = 14, y = 0.35) {
  return useMemo(() => {
    const perSide = Math.ceil(count / 4)
    const pts = []
    const step = (2 * radius) / (perSide - 1 || 1)
    // bottom L->R
    for (let i = 0; i < perSide; i++) pts.push(new THREE.Vector3(-radius + i * step, y, radius))
    // right B->T
    for (let i = 1; i < perSide; i++) pts.push(new THREE.Vector3(radius, y, radius - i * step))
    // top R->L
    for (let i = 1; i < perSide; i++) pts.push(new THREE.Vector3(radius - i * step, y, -radius))
    // left T->B
    for (let i = 1; i < perSide - 1; i++) pts.push(new THREE.Vector3(-radius, y, -radius + i * step))
    return pts.slice(0, count)
  }, [count, radius, y])
}

/* ------------ Movement controller (INSIDE Canvas) ------------ */
function MovementController({ pieceRef, path, targetIndex, onArrive, onMoveState, speed = 7 }) {
  const lastIdx = useRef(targetIndex)

  useFrame((_, delta) => {
    const mesh = pieceRef?.current
    const dest = path[targetIndex]
    if (!mesh || !dest) return

    const current = new THREE.Vector3().copy(mesh.position)
    const dir = dest.clone().sub(current)
    const dist = dir.length()
    const step = Math.min(dist, speed * delta)

    if (dist <= 0.02) {
      mesh.position.copy(dest)
      if (lastIdx.current !== targetIndex) {
        lastIdx.current = targetIndex
        onMoveState?.(false)          // stop walking
        onArrive?.(targetIndex)
      }
      return
    }

    // still moving
    onMoveState?.(true)
    dir.normalize().multiplyScalar(step)
    current.add(dir)
    mesh.position.copy(current)
    // face movement direction a little (optional)
    mesh.rotation.y = Math.atan2(dir.x, dir.z)
  })

  return null
}

/* ------------ Orbit limits ------------ */
function LimitedOrbit() {
  return (
    <OrbitControls
      enableDamping
      enablePan
      panSpeed={0.5}
      target={[0, 0, 0]}
      minDistance={10}
      maxDistance={30}
      minPolarAngle={0.8}
      maxPolarAngle={1.4}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  )
}

/* ------------ Main viewer ------------ */
export default function GameBoardViewer({
  glbPath = "/game/Monopoly_Game.glb",
  charactersGlb = "/game/Monopoly_Characters.glb",
  selectedCharacter = "Cowboy",      // ← pass from lobby (e.g. 'Ninja.001')
  camera = { position: [0, 26, 42], fov: 38 },
  exposure = 1.1,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  // NEW: keep surface height in state
  const [boardSurfaceY, setBoardSurfaceY] = useState(0.0)
  const boardMeshesRef = useRef([])

  // board + gameplay state
  const path = useBoardPath(BOARD_ORDER.length, 14, boardSurfaceY)
  const [tileIndex, setTileIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const pieceRef = useRef()

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTile, setActiveTile] = useState(null)

  // NEW: dice state
  const [diceResult, setDiceResult] = useState(null)
  const [showDiceResult, setShowDiceResult] = useState(false)

  const rollDice = () => Math.floor(Math.random() * 6) + 1
  
  const handleRoll = () => {
    const result = rollDice()
    setDiceResult(result)
    setShowDiceResult(true)
    
    const dest = (tileIndex + result) % BOARD_ORDER.length
    setIsMoving(true)           // start walking animation
    setTileIndex(dest)
    
    // Hide the dice result after 3 seconds
    setTimeout(() => {
      setShowDiceResult(false)
    }, 3000)
  }

  // when movement controller reaches tileIndex
  const handleArrive = (idx) => {
    const tileId = BOARD_ORDER[idx]
    setActiveTile(BOARD_TILES[tileId])
    setModalOpen(true)
  }

  /* ------------ Board model (reports surface height) ------------ */
  function BoardModel({ src, onReady }) {
    const gltf = useGLTF(src)

    useEffect(() => {
      const scene = gltf.scene
      if (!scene) return

      // lighting/material defaults
      scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true
          o.receiveShadow = true
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => {
            if (!m) return
            m.metalness = 0
            m.roughness = 0.5
            m.envMapIntensity = 0
          })
        }
      })

      // Center board at origin (so camera/controls are predictable)
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      scene.position.sub(center)

      // Report an accurate "top surface" Y (+ a tiny offset so we don't z-fight)
      const surfaceY = box.max.y - center.y + 0.01
      onReady?.({ surfaceY, bounds: box, center })

    }, [gltf, onReady])

    // IMPORTANT: keep rotationY = 0 so the board edges align with the screen
    return <group rotation={[0, 0, 0]} scale={1}><primitive object={gltf.scene} /></group>
  }

  function LimitedOrbit() {
    const { gl } = useThree()
    return (
      <OrbitControls
        makeDefault
        domElement={gl.domElement}
        enableDamping
        target={[0, 0, 0]}
        // distance limits (prevents zooming too far)
        minDistance={16}
        maxDistance={16}
        // keep a nice top-front angle (no upside-down)
        minPolarAngle={0.9}   // ~52° down from +Y
        maxPolarAngle={1.25}  // ~72° down
        // optional: allow a tiny pan for UX
        enablePan={true}
        panSpeed={0.4}
      />
    )
  }

  // ensure the piece starts at the correct position on mount
  useEffect(() => {
    if (pieceRef.current && path[0]) {
      pieceRef.current.position.copy(path[0])
    }
  }, [path])

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-inner">
      <Canvas
        dpr={[0.8, 1.2]}
        gl={{ powerPreference: "high-performance", antialias: true }}
        shadows
        camera={camera}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = exposure
          if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace
          setIsLoaded(true)
        }}
      >
        <color attach="background" args={["#f2f5f8"]} />
        <RendererTuning exposure={exposure} />
        <BoardRig />

        <Suspense fallback={<Loader />}>
          <BoardModel
            src={glbPath}
            onReady={({ surfaceY, meshes }) => {
              setBoardSurfaceY(surfaceY)
              boardMeshesRef.current = meshes
            }}
          />

          <CharacterPawn
            ref={pieceRef}
            src={charactersGlb}
            focus={selectedCharacter}
            play={isMoving ? "Walk" : "Idle"}
            position={path[0]?.toArray() ?? [0, boardSurfaceY, 0]}  // sits ON the board
            scale={1}
          />

          <MovementController
            pieceRef={pieceRef}
            path={path}
            targetIndex={tileIndex}
            onArrive={handleArrive}
            onMoveState={setIsMoving}
          />
          <Preload all />
        </Suspense>


        <AdaptiveDpr pixelated />
        <LimitedOrbit />
      </Canvas>

      {/* hint */}
      {isLoaded && (
        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 text-xs text-gray-600 shadow">
          Drag to rotate • Scroll to zoom
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          onClick={handleRoll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-600 transition-colors"
          title="Roll Dice"
          disabled={isMoving || showDiceResult}
        >
          <FaDice className="text-lg" />
          Roll Dice
        </button>

        <div className="px-3 py-2 rounded-xl bg-white/90 border shadow text-sm">
          Tile: <span className="font-semibold">{BOARD_TILES[BOARD_ORDER[tileIndex]]?.label}</span>
        </div>

        {/* Dice result display */}
        {showDiceResult && (
          <div className="px-4 py-2 rounded-xl bg-lime-500 text-white font-bold text-lg shadow-lg animate-pulse">
            {diceResult}
          </div>
        )}
      </div>

      {/* Tooltip Modal */}
      <BoardTileModal
        open={modalOpen}
        data={activeTile}
        onClose={() => setModalOpen(false)}
        onAction={() => setModalOpen(false)}
      />
    </div>
  )
}