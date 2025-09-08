import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'

const VALID = ['Cowboy', 'Green_girl', 'Kimono_girl', 'Lilac_girl', 'Mr_suit', 'Ninja.001']
const norm = (s = '') => s.toLowerCase().replace(/[\s_.-]+/g, '').trim()

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

function hasMesh(obj) {
  let ok = false
  obj?.traverse?.((n) => { if (n.isMesh) ok = true })
  return ok
}

function centerAndFit(object, three, {
  margin = 1.18,      // padding around the model (1.0 = tight)
  polar = 1.25,      // vertical angle (radians) ~72° from +Y (nice eye-level)
  azimuth = 0.35      // horizontal angle (radians) ~20° to the right
} = {}) {
  if (!object) return

  const { camera, controls } = three
  // 1) center the model on the origin
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())        // full extents
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)                          // origin at model center

  // 2) choose target at the model center (ensures symmetric framing)
  const target = new THREE.Vector3(0, 0, 0)
  controls?.target.copy(target)

  // 3) compute distance so the full HEIGHT fits the vertical FOV
  const height = Math.max(size.y, 1e-3)
  const fov = (camera.fov * Math.PI) / 180
  const dist = (height * margin) / (2 * Math.tan(fov / 2))

  // 4) place the camera at a consistent spherical angle
  camera.position.setFromSphericalCoords(dist, polar, azimuth)
  camera.near = Math.max(0.01, dist * 0.02)
  camera.far = dist * 20
  camera.updateProjectionMatrix()

  controls?.update()
}

function CharacterScene({ src, focus }) {
  const { scene } = useGLTF(src)
  const three = useThree()

  // enable shadows / neutralize materials a bit
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (m) {
            m.metalness = 0
            m.roughness = 0.5
            m.envMapIntensity = 0
          }
        })
      }
    })
  }, [scene])

  // Prefer a single top-level wrapper if present
  const container = useMemo(() => {
    const c =
      scene?.children?.length === 1 && scene.children[0]?.children?.length
        ? scene.children[0]
        : scene
    return c
  }, [scene])

  function findCandidates(node) {
    const out = []
    if (!node) return out

    for (const child of node.children || []) {
      if (!child?.name || /camera|light/i.test(child.name)) continue

      if (hasMesh(child)) {
        out.push(child)
      } else {
        // if any descendant has a mesh, keep this child as a candidate
        let descendantHasMesh = false
        child.traverse((n) => { if (n.isMesh) descendantHasMesh = true })
        if (descendantHasMesh) out.push(child)
      }
    }
    return out
  }

  const candidates = useMemo(() => {
    let kids = findCandidates(container)
    if (kids.length === 0 && hasMesh(container)) {
      console.log('[Characters GLB] no children — using container itself')
      return [container]
    }
    console.log('[Characters GLB] container:', container?.name, '| candidates:', kids.map((k) => k.name))
    return kids
  }, [container])


  // Choose by fuzzy name; if only the container is present, just use it
  const chosen = useMemo(() => {
    if (!candidates || candidates.length === 0) return null
    if (candidates.length === 1) return candidates[0]

    const want = norm(typeof focus === 'string' && focus ? focus : VALID[0])
    return (
      candidates.find((c) => norm(c.name) === want) ||
      candidates.find((c) => norm(c.name).includes(want)) ||
      candidates[0]
    )
  }, [candidates, focus])

  useEffect(() => {
    if (chosen) {
      // show only the chosen root (children remain visible)
      container?.children?.forEach((c) => { c.visible = c === chosen })
      // full-body, consistent initial angle
      centerAndFit(chosen, three, { margin: 1.18, polar: 1.25, azimuth: 0.35 })
    } else {
      container?.children?.forEach((c) => (c.visible = true))
      centerAndFit(scene, three, { margin: 1.18, polar: 1.25, azimuth: 0.35 })
    }
  }, [chosen, container, scene, three])

  // dispose={null} prevents GLTF from being auto-disposed on unmount/remount
  return <primitive object={scene} rotation={[0, Math.PI / 10, 0]} dispose={null} />
}

export default function CharacterSelectViewer({
  glbPath = '/game/Monopoly_Game.glb',
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
        <OrbitControls
          enablePan={false}
          minDistance={1.0}            // these are soft; camera was positioned by centerAndFit
          maxDistance={100}
          minPolarAngle={0.8}          // stop the camera from going under the floor
          maxPolarAngle={1.45}
          enableDamping
          dampingFactor={0.07}
        />

      </Canvas>
    </div>
  )
}
