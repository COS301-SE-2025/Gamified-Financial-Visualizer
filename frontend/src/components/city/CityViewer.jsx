import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

function CityModel() {
  const { scene } = useGLTF('/Full City.glb')
  return <primitive object={scene} scale={2} />
}

export default function CityViewer() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 10, 30], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <Suspense fallback={null}>
          <CityModel />
        </Suspense>
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  )
}
