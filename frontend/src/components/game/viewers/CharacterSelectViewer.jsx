// CharacterSelectViewer.jsx
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF, useProgress, useAnimations } from '@react-three/drei'
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
  margin = 1.18,
  polar = 1.25,
  azimuth = 0.35
} = {}) {
  if (!object) return
  const { camera, controls } = three

  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)

  const target = new THREE.Vector3(0, 0, 0)
  controls?.target.copy(target)

  const height = Math.max(size.y, 1e-3)
  const fov = (camera.fov * Math.PI) / 180
  const dist = (height * margin) / (2 * Math.tan(fov / 2))

  camera.position.setFromSphericalCoords(dist, polar, azimuth)
  camera.near = Math.max(0.01, dist * 0.02)
  camera.far = dist * 20
  camera.updateProjectionMatrix()
  controls?.update()
}

function CharacterScene({ src, focus, play = 'Idle' }) {
  const group = useRef()
  const { scene, animations } = useGLTF(src)
  const three = useThree()
  const { actions, clips } = useAnimations(animations, group)

  // neutral materials / shadows
  useEffect(() => {
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
  }, [scene])

  const container = useMemo(() => {
    return (scene?.children?.length === 1 && scene.children[0]?.children?.length)
      ? scene.children[0]
      : scene
  }, [scene])

  function findCandidates(node) {
    const out = []
    if (!node) return out
    for (const child of node.children || []) {
      if (!child?.name || /camera|light/i.test(child.name)) continue
      if (hasMesh(child)) out.push(child)
      else {
        let descendantHasMesh = false
        child.traverse((n) => { if (n.isMesh) descendantHasMesh = true })
        if (descendantHasMesh) out.push(child)
      }
    }
    return out
  }

  const candidates = useMemo(() => {
    const kids = findCandidates(container)
    if (kids.length === 0 && hasMesh(container)) return [container]
    return kids
  }, [container])

  const chosen = useMemo(() => {
    if (!candidates?.length) return null
    if (candidates.length === 1) return candidates[0]
    const want = norm(typeof focus === 'string' && focus ? focus : VALID[0])
    return (
      candidates.find((c) => norm(c.name) === want) ||
      candidates.find((c) => norm(c.name).includes(want)) ||
      candidates[0]
    )
  }, [candidates, focus])

  // show only chosen & frame
  useEffect(() => {
    if (chosen) {
      container?.children?.forEach((c) => { c.visible = c === chosen })
      centerAndFit(chosen, three, { margin: 1.18, polar: 1.25, azimuth: 0.35 })
    } else {
      container?.children?.forEach((c) => (c.visible = true))
      centerAndFit(scene, three, { margin: 1.18, polar: 1.25, azimuth: 0.35 })
    }
  }, [chosen, container, scene, three])

  // pick a clip name that matches this character + desired action
  const pickClipName = (want = 'Idle') => {
    if (!clips?.length) return null
    const w = norm(want)
    const cname = norm(chosen?.name || '')

    // prefer actions that mention the chosen character
    const scoped = clips.filter((c) => {
      const n = norm(c.name)
      return n.includes(cname) || cname.includes(n)
    })

    const pool = scoped.length ? scoped : clips

    return (
      pool.find((c) => norm(c.name) === w)?.name ||
      pool.find((c) => norm(c.name).includes(w))?.name ||
      (w === 'idle' && (pool.find((c) => /idle|stand/i.test(c.name))?.name)) ||
      (w === 'walk' && (pool.find((c) => /walk|run|move/i.test(c.name))?.name)) ||
      pool[0]?.name
    )
  }

  // play / crossfade (guard cleanup to avoid hot-reload errors)
  useEffect(() => {
    const name = pickClipName(play)
    if (!name || !actions) return
    const act = actions[name]
    if (!act) return
    act.reset().fadeIn(0.25).play()
    return () => {
      const a = actions[name]
      if (a && a.enabled) {
        try { a.fadeOut(0.25) } catch {}
      }
    }
  }, [actions, clips, chosen, play])

  return (
    <group ref={group}>
      <primitive object={scene} rotation={[0, Math.PI / 10, 0]} dispose={null} />
    </group>
  )
}

export default function CharacterSelectViewer({
  glbPath = '/game/Monopoly_Characters.glb',
  focus = 'Cowboy',
  play = 'Idle',          // 'Idle' | 'Walk' | etc. (fuzzy-matched)
}) {
  useGLTF.preload(glbPath)
  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden bg-[#f2f5f8]">
      <Canvas shadows camera={{ position: [0, 1.2, 3.2], fov: 35 }}>
        <color attach="background" args={['#f2f5f8']} />
        <hemisphereLight intensity={0.6} skyColor={'#fff7e6'} groundColor={'#d9c3a8'} />
        <directionalLight position={[3, 4, 2]} intensity={1.7} castShadow />
        <Suspense fallback={<Loader />}>
          <CharacterScene src={glbPath} focus={focus} play={play} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.0}
          maxDistance={100}
          minPolarAngle={0.8}
          maxPolarAngle={1.45}
          enableDamping
          dampingFactor={0.07}
        />
      </Canvas>
    </div>
  )
}
