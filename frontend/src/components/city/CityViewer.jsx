import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei'
import { Suspense } from 'react'
import { FaBuilding, FaBank, FaCoffee, FaShoppingCart, FaHospital, FaHotel, FaPoliceBox, FaHome, FaBandAid } from 'react-icons/fa';
import { HiOfficeBuilding } from 'react-icons/hi'
import { GiPoliceBadge } from 'react-icons/gi'

// Interactive buildings in the 3D city model
const INTERACTIVE_BUILDINGS = [
  'apartment', 'apartment2',
  'Bank', 'Coffee Shop',
  'Grocery Store', 'Hospital',
  'Hotel', 'Office', 'Office_2',
  'Police Station', 'Normal House'
]

// Tooltip information and icons 
const BUILDING_INFO = {
  apartment: { 
    icon: <FaBuilding size={20} className="text-blue-500" />, 
    description: 'Residential apartment complex with multiple units' 
  },
  apartment2: { 
    icon: <FaBuilding size={20} className="text-blue-500" />, 
    description: 'Modern apartment building with amenities' 
  },
  bank: { 
    icon: <FaBandAid size={20} className="text-green-600" />, 
    description: 'Financial institution for deposits and loans' 
  },
  coffeeshop: { 
    icon: <FaCoffee size={20} className="text-brown-500" />, 
    description: 'Local café serving coffee and light meals' 
  },
  grocerystore: { 
    icon: <FaShoppingCart size={20} className="text-green-500" />, 
    description: 'Supermarket with fresh produce and groceries' 
  },
  hospital: { 
    icon: <FaHospital size={20} className="text-red-500" />, 
    description: 'Medical facility for emergency and routine care' 
  },
  hotel: { 
    icon: <FaHotel size={20} className="text-yellow-500" />, 
    description: 'Lodging for travelers and tourists' 
  },
  office: { 
    icon: <HiOfficeBuilding size={20} className="text-gray-600" />, 
    description: 'Corporate office space for businesses' 
  },
  office2: { 
    icon: <HiOfficeBuilding size={20} className="text-gray-600" />, 
    description: 'Professional workspace with meeting rooms' 
  },
  policestation: { 
    icon: <GiPoliceBadge size={20} className="text-blue-600" />, 
    description: 'Law enforcement headquarters for public safety' 
  },
  normalhouse: { 
    icon: <FaHome size={20} className="text-orange-500" />, 
    description: 'Single-family residential home' 
  }
}

export function CityModel() {
  const { scene } = useGLTF('/Classic_Day_City.glb')
  const [activeBuilding, setActiveBuilding] = useState(null)
  const [interactiveObjects, setInteractiveObjects] = useState([])

  const normalize = (str) => str.toLowerCase().replace(/\s|_/g, '')
  const formatName = (name) =>
    name.replace(/[_\.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const getBuildingInfo = (name) => {
    const normalized = normalize(name)
    return BUILDING_INFO[normalized] || {
      icon: <FaBuilding size={20} />,
      description: 'Building information'
    }
  }

  useEffect(() => {
    // Scale & position the scene
    scene.scale.set(0.5, 0.5, 0.5)
    scene.position.set(0, 0, 0)

    const found = []
    scene.traverse((obj) => {
      const isMatch = INTERACTIVE_BUILDINGS.some(name =>
        normalize(obj.name) === normalize(name)
      )
      if (isMatch && (obj.isMesh || obj.children?.some(c => c.isMesh))) {
        found.push(obj)
      }
    })
    setInteractiveObjects(found)
  }, [scene])

  return (
    <group>
      {/* Entire city */}
      <primitive object={scene} />

      {/* Interactive overlays */}
      {interactiveObjects.map((obj, idx) => (
        <group
          key={idx}
          onClick={(e) => {
            e.stopPropagation()
            setActiveBuilding(activeBuilding?.uuid === obj.uuid ? null : obj)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          {activeBuilding?.uuid === obj.uuid && (
            <Html 
              center 
              position={[obj.position.x, obj.position.y + 5, obj.position.z]}
              distanceFactor={10}
            >
              <div className="relative w-64 bg-white rounded-3xl shadow-lg border border-gray-100 p-4 text-sm text-gray-700 font-semibold">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-100 rounded-full blur-sm opacity-40"></div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-200 rounded-full blur-sm opacity-30"></div>
                <div className="flex flex-col gap-2 z-10 relative">
                  <div className="flex items-center gap-2">
                    <span>{getBuildingInfo(obj.name).icon}</span>
                    <span className="font-bold">{formatName(obj.name)}</span>
                  </div>
                  <p className="text-xs font-normal text-gray-500">
                    {getBuildingInfo(obj.name).description}
                  </p>
                </div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

// Styling for the actual city
export default function CityViewer() {
  return (
    <div className="w-full h-screen bg-[#f9f9f9]">
      <Canvas
        // shadows enables shadows 
        shadows
        camera={{ position: [-40, 40, 100], fov: 45 }}
        onClick={(e) => e.stopPropagation()}>
        <ambientLight intensity={0.4} />
        <directionalLight
          // Tone mapping and color intensity
          color="#fffbe6"
          castShadow
          position={[50, 80, 100]}
          intensity={1.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <Suspense fallback={null}>
          <CityModel />
          {/* Preset options: 
          apartment, city, dawn, forest, lobby, night, sunset, warehouse*/}
          <Environment preset="apartment" background={false} />
        </Suspense>
        <OrbitControls
          enableDamping
          enablePan={false}
          // rotaiton from left and right on z-axis 
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 0}
          maxAzimuthAngle={Math.PI / 0}
          // scrolling distance
          // scrolling in
          minDistance={8}
          // scrolling out
          maxDistance={8}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
