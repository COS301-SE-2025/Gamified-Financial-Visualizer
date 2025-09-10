// src/components/game/EnhancedGameBoardViewer.jsx
import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF, useProgress, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Preload early
useGLTF.preload('/game/Monopoly_Game.glb')

// Loader
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="px-4 py-3 rounded-xl bg-white/95 border border-gray-200 text-sm text-gray-700 shadow-lg backdrop-blur-sm"
      >
        Loading board… {Math.round(progress)}%
      </motion.div>
    </Html>
  )
}

// Renderer tuning
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

// Improved lighting
function EnhancedBoardRig() {
  return (
    <>
      <hemisphereLight skyColor={'#fff4e6'} groundColor={'#d9c3a8'} intensity={0.6} />
      <directionalLight
        color={'#FFD4B8'}
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
      <directionalLight color={'#BFD8FF'} position={[-50, 30, -30]} intensity={0.9} />
      <ambientLight intensity={0.15} />
    </>
  )
}

// Board model
function BoardModel({ src, scale = 1, rotationY = Math.PI / 4.5 }) { // Slightly adjusted angle
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
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    scene.position.sub(center)
  }, [gltf])

  return (
    <group rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// Camera controls with better default angle
function EnhancedOrbitControls() {
  return (
    <OrbitControls
      enableDamping
      enablePan={true}
      panSpeed={0.5}
      target={[0, 0, 0]}
      minDistance={10}
      maxDistance={30}
      minPolarAngle={0.8}  // Better viewing angle
      maxPolarAngle={1.4}   // Better viewing angle
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  )
}

// Public API
export default function EnhancedGameBoardViewer({
  glbPath = '/game/Monopoly_Game.glb',
  camera = { position: [65, 20, 38], fov: 38 }, // Better starting position
  exposure = 1.1,
}) {
  useGLTF.preload(glbPath)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-inner"
    >
      <Canvas
        dpr={[0.8, 1.2]} // Slightly higher quality
        gl={{ 
          powerPreference: 'high-performance',
          antialias: true
        }}
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
        <color attach="background" args={['#f2f5f8']} />
        <RendererTuning exposure={exposure} />

        <EnhancedBoardRig />

        <Suspense fallback={<Loader />}>
          <BoardModel src={glbPath} rotationY={Math.PI / 4.5} />
          <Preload all />
        </Suspense>

        <AdaptiveDpr pixelated />
        <EnhancedOrbitControls />
      </Canvas>

      {isLoaded && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 text-xs text-gray-600 shadow"
        >
          Drag to rotate • Scroll to zoom
        </motion.div>
      )}
    </motion.div>
  )
}