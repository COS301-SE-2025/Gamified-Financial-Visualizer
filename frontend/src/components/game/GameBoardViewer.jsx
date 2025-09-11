import React, { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, useGLTF, useProgress, AdaptiveDpr, Preload } from "@react-three/drei"
import * as THREE from "three"
import BoardTileModal from "./BoardTileModal"
import { BOARD_TILES, BOARD_ORDER } from "../../components/game/data/boardTiles"
import { FaDice } from "react-icons/fa"

// Preload board GLB
useGLTF.preload("/game/Monopoly_Game.glb")

/* ------------ Loader ------------ */
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="px-4 py-2 rounded-xl bg-white/95 border border-gray-200 text-sm text-gray-700 shadow-lg">
        Loading board… {Math.round(progress)}%
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
function BoardModel({ src, rotationY = Math.PI / 4.5 }) {
  const gltf = useGLTF(src)
  useEffect(() => {
    const scene = gltf.scene
    if (!scene) return
    scene.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      o.receiveShadow = true
      const mats = Array.isArray(o.material) ? o.material : [o.material]
      mats.forEach((m) => {
        if (!m) return
        m.metalness = 0
        m.roughness = 0.5
        m.envMapIntensity = 0
      })
    })
    // center scene
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    scene.position.sub(center)
  }, [gltf])

  return (
    <group rotation={[0, rotationY, 0]} scale={1}>
      <primitive object={gltf.scene} />
    </group>
  )
}

/* ------------ Player piece ------------ */
const PlayerPiece = React.forwardRef(function PlayerPiece({ initial = [0, 0.5, 0], color = "#1e90ff" }, ref) {
  return (
    <mesh ref={ref} position={initial} castShadow>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0} />
    </mesh>
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
function MovementController({ pieceRef, path, targetIndex, onArrive, speed = 7 }) {
  const lastIndexRef = useRef(targetIndex)

  useEffect(() => {
    // snap piece to current target if it has no position yet
    if (pieceRef?.current && path[targetIndex]) {
      // no-op; the animation will lerp from current to target
    }
  }, [pieceRef, path, targetIndex])

  useFrame((_, delta) => {
    const mesh = pieceRef?.current
    const dest = path[targetIndex]
    if (!mesh || !dest) return

    const current = new THREE.Vector3().copy(mesh.position)
    const dir = dest.clone().sub(current)
    const dist = dir.length()
    const step = Math.min(dist, speed * delta)

    if (dist <= 0.02) {
      // Arrived
      mesh.position.copy(dest)
      if (lastIndexRef.current !== targetIndex) {
        lastIndexRef.current = targetIndex
        onArrive?.(targetIndex)
      }
      return
    }

    dir.normalize().multiplyScalar(step)
    current.add(dir)
    mesh.position.copy(current)
  })

  return null
}

/* ------------ Orbit limits ------------ */
function LimitedOrbit() {
  return (
    <OrbitControls
      enableDamping
      enablePan={true}
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
  camera = { position: [65, 20, 38], fov: 38 },
  exposure = 1.1,
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  // board + gameplay state
  const path = useBoardPath(BOARD_ORDER.length, 14, 0.35)
  const [tileIndex, setTileIndex] = useState(0)
  const pieceRef = useRef()

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTile, setActiveTile] = useState(null)

  // dice + move
  const rollDice = () => Math.floor(Math.random() * 6) + 1
  const handleRoll = () => {
    const steps = rollDice()
    const dest = (tileIndex + steps) % BOARD_ORDER.length
    setTileIndex(dest)
  }

  // when movement controller reaches tileIndex
  const handleArrive = (idx) => {
    const tileId = BOARD_ORDER[idx]
    setActiveTile(BOARD_TILES[tileId])
    setModalOpen(true)
  }

  // action dispatcher (stub)
  const handleTileAction = (tile) => {
    // TODO: plug into your game engine (buy/pay/earn/etc.)
    setModalOpen(false)
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
          <BoardModel src={glbPath} rotationY={Math.PI / 4.5} />
          <PlayerPiece ref={pieceRef} initial={path[0]?.toArray() ?? [0, 0.5, 0]} />
          <MovementController
            pieceRef={pieceRef}
            path={path}
            targetIndex={tileIndex}
            onArrive={handleArrive}
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-600"
          title="Roll Dice"
        >
          <FaDice className="text-lg" />
          Roll Dice
        </button>

        <div className="px-3 py-2 rounded-xl bg-white/90 border shadow text-sm">
          Tile: <span className="font-semibold">{BOARD_TILES[BOARD_ORDER[tileIndex]]?.label}</span>
        </div>
      </div>

      {/* Tooltip Modal */}
      <BoardTileModal
        open={modalOpen}
        data={activeTile}
        onClose={() => setModalOpen(false)}
        onAction={handleTileAction}
      />
    </div>
  )
}
