// src/components/game/GameBoardViewer.jsx
import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'

// ---------- Loader ----------
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="px-3 py-2 rounded-lg bg-white/90 border text-sm text-gray-700 shadow">
        Loading board… {Math.round(progress)}%
      </div>
    </Html>
  )
}

// ---------- Renderer tuning (same pattern as CityViewer) ----------
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

// ---------- A neutral bright rig (mirrors BrightDayRig idea) ----------
function BrightBoardRig() {
  return (
    <>
      <hemisphereLight skyColor={'#fff4e6'} groundColor={'#d9c3a8'} intensity={0.55} />
      <directionalLight
        color={'#FFD4B8'}
        position={[60, 120, 60]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-bias={-0.0006}
        shadow-normalBias={0.6}
      />
      <directionalLight color={'#BFD8FF'} position={[-60, 40, -40]} intensity={0.9} />
      <ambientLight intensity={0.12} />
    </>
  )
}

// ---------- Board model ----------
function BoardModel({ src, scale = 1, rotationY = Math.PI / 4 }) {
  const gltf = useGLTF(src)

  // Center the scene so the camera target is (0,0,0)
  useEffect(() => {
    const scene = gltf.scene
    if (!scene) return
    // enable shadows + neutral materials
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
    // auto-center
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    scene.position.sub(center) // shift so center sits at origin
  }, [gltf])

  // Rotate the *group*, not the GLB contents
  return (
    <group rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// ---------- Public API ----------
export default function GameBoardViewer({
  glbPath = '/game/Monopoly_Game.glb',
  // Shallow look: lower Y, longer Z; narrower FOV keeps scale believable
  camera = { position: [72, 22, 42], fov: 40 },
  exposure = 1.05,
}) {
  useGLTF.preload(glbPath)

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-[#f2f5f8] dark:bg-[#0E171F] rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={camera}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = exposure
          if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <color attach="background" args={['#f2f5f8']} />
        <RendererTuning exposure={exposure} />

        {/* Lights (kept consistent with your city rig feel) */}
        <BrightBoardRig />

        <Suspense fallback={<Loader />}>
          {/* 45° yaw for that diagonal board edge look */}
          <BoardModel src={glbPath} rotationY={Math.PI / 4} />
        </Suspense>

        {/* Orbit: shallow angle range + a bit of zoom room */}
        <OrbitControls
          enableDamping
          enablePan={false}
          target={[0, 0, 0]}
          minDistance={8}
          maxDistance={26}
          // Polar angle measured from +Y axis. For a low, table-level view,
          // allow ~50°–75° (radians ~0.87–1.31).
          minPolarAngle={0.9}
          maxPolarAngle={1.28}
        />
      </Canvas>
    </div>
  )
}
