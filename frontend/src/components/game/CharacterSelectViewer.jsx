import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'

const VALID = ['Cowboy','Green_girl','Kimono_girl','Lilac_girl','Mr_suit','Ninja.001']
const norm = (s='') => s.toLowerCase().replace(/[\s_.-]+/g,'').trim()

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="px-2 py-1 rounded bg-white/90 border text-xs text-gray-700 shadow">
        Loading… {Math.round(progress)}%
      </div>
    </Html>
  )
}

function hasMesh(o) {
  let ok = false
  o?.traverse?.((n) => { if (n.isMesh) ok = true })
  return ok
}

function centerAndFit(object, three, margin = 1.35) {
  if (!object) return
  // center on origin
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)

  // fit camera
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const { camera, controls } = three
  const fov = (camera.fov * Math.PI) / 180
  let dist = (maxDim * margin) / (2 * Math.tan(fov / 2))
  dist = THREE.MathUtils.clamp(dist, 2.2, 6)

  camera.position.set(0, 0.9, dist)
  camera.near = 0.1
  camera.far = 50
  camera.updateProjectionMatrix()
  controls?.target.set(0, 0.6, 0)
  controls?.update()
}

function CharacterScene({ src, focus }) {
  const { scene } = useGLTF(src)
  const three = useThree()

  // enable shadows / neutralize materials
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => { if (m) { m.metalness = 0; m.roughness = 0.5; m.envMapIntensity = 0 } })
      }
    })
  }, [scene])

  // Step 1: prefer a wrapper with many children (e.g., "Collection"); else use scene
  const container = useMemo(() => {
    if (scene.children?.length === 1 && scene.children[0]?.children?.length) return scene.children[0]
    return scene
  }, [scene])

  // Step 2: collect character roots that contain meshes (children or grandchildren)
  const candidates = useMemo(() => {
    let kids = (container.children || []).filter(c => c.name && !/camera|light/i.test(c.name) && hasMesh(c))
    if (kids.length === 0) {
      const tmp = []
      ;(container.children || []).forEach((c) => (c.children || []).forEach((g) => hasMesh(g) && tmp.push(g)))
      kids = tmp
    }
    console.log('[Characters GLB] container:', container?.name, 'candidates:', kids.map(k => k.name))
    return kids
  }, [container])

  // Step 3: pick by fuzzy name; else first; else fall back to WHOLE SCENE
  const chosen = useMemo(() => {
    if (candidates.length === 0) return null
    const want = norm(typeof focus === 'string' && focus ? focus : VALID[0])
    let match = candidates.find(c => norm(c.name) === want) || candidates.find(c => norm(c.name).includes(want))
    if (!match) match = candidates[0]
    console.log('[Characters GLB] chosen:', match?.name, 'for focus:', focus)
    return match
  }, [candidates, focus])

  useEffect(() => {
    // If we found a character, hide its siblings; otherwise fit to the whole scene
    if (chosen) {
      (container.children || []).forEach((c) => { if (hasMesh(c)) c.visible = (c === chosen) })
      if (chosen.parent && chosen.parent !== container) {
        (chosen.parent.children || []).forEach((s) => { if (hasMesh(s)) s.visible = (s === chosen) })
      }
      centerAndFit(chosen, three)
    } else {
      // last-resort: show entire scene
      centerAndFit(scene, three)
    }
  }, [chosen, container, scene, three])

  return <primitive object={scene} rotation={[0, Math.PI / 10, 0]} />
}

export default function CharacterSelectViewer({
  glbPath = '/game/Monopoly_Characters.glb',
  focus = 'Cowboy',
}) {
  useGLTF.preload(glbPath)
  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden bg-[#f2f5f8]">
      <Canvas shadows camera={{ position: [0, 1.2, 3.2], fov: 35 }}>
        <color attach="background" args={['#f2f5f8']} />
        <hemisphereLight intensity={0.6} skyColor={'#fff7e6'} groundColor={'#d9c3a8'} />
        <directionalLight position={[3, 4, 2]} intensity={1.7} castShadow />
        <Suspense fallback={<Loader />}>
          <CharacterScene src={glbPath} focus={focus} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2.3} maxDistance={3.7} />
      </Canvas>
    </div>
  )
}
