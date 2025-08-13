// CityViewer.jsx (lighting-rig version with mapping + crash guard updates)
import { useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Html, useGLTF, useHelper } from '@react-three/drei'
import { Suspense } from 'react'
import {
  GiBank, GiHospitalCross, GiCoffeeCup, GiPoliceBadge, GiHouse, GiAirBalloon, GiArchiveResearch, GiHotelBell,
  GiWoodenSign
} from 'react-icons/gi'
import { FaTimes } from 'react-icons/fa'

/* ===========================
   Lighting presets (Day/Night)
=========================== */
const DAY_LIGHT = {
  sunMain: { pos: [60, 85, 90], color: '#ffdcb3', intensity: 2.2 },
  sunFill: { pos: [-40, 35, -55], color: '#cfe6ff', intensity: 0.6 },
  hemi: { sky: '#b6d5ff', ground: '#624a3a', intensity: 0.25 },
  ambient: { color: '#ffffff', intensity: 0.05 },
  exposure: 1.0,
}
const NIGHT_LIGHT = {
  sunMain: { pos: [-30, 30, 20], color: '#7ab2ff', intensity: 0.35 },
  sunFill: { pos: [20, 10, -30], color: '#3d67ff', intensity: 0.25 },
  hemi: { sky: '#1a2a44', ground: '#04070b', intensity: 0.35 },
  ambient: { color: '#0b0e14', intensity: 0.15 },
  exposure: 0.7,
}

/* ===========================
   Config & helpers
=========================== */
const BEACON_OFFSET_Y = 0.8
const OFFSETS_BY_KEY = {}

const pretty = (s) =>
  s.replace(/[_\.]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

const EXTRA_BUILDING_KEYS = new Set(['Office_2', 'Large_Apartments', 'BARRA_CAFE_AL_PASO'])
const EXCLUDED_PREFIXES = [
  'Road_', 'Cloud', 'van', 'taxi', 'bus', 'pickup', 'sedan',
  'Fire_Hydrant', 'garbagebin', 'Mail_Box', 'Circle', 'Cube', 'Cylinder',
  'Plane', 'Text', 'Icosphere', 'Banner',
]

// UPDATED: Beacon labels (what appears above buildings)
const FRIENDLY_LABELS = {
  Building_E001: 'Hospital',
  Building_C001: 'Bank',
  Large_Apartments: 'Library',              // renamed from “Large Apartments”
  Building_F003: 'Food Market',
  Building_G004: 'Residences',
  Building_G005: 'Residences',
  Building_G001: 'Residences',
  Office_2: 'Civic Offices',
  Building_D001: 'Police Station',
  Building_B001: 'Hotel',
  BARRA_CAFE_AL_PASO: 'Café',
}

/* ========= Tooltip bindings (your requested insights) ========= */
// UPDATED: All cards aligned to your list
const BUILDING_BINDINGS = {
  // Hospital → financial health / sentiment
  Building_E001: {
    icon: <GiHospitalCross className="text-red-400" />,
    label: 'Hospital',
    kpis: [
      'Medical spend MTD: R320',
      'Health emergency fund: 62% funded',
      'Financial health sentiment: 72/100'
    ],
    quest: 'Top up Health EF by R300 to reach 100% by December',
    cta: { label: 'View Health Finances', link: '/goals?tag=health' },
  },

  // Bank → transaction stats (income/expense)
  Building_C001: {
    icon: <GiBank className="text-emerald-500" />,
    label: 'Bank',
    kpis: [
      'Income (Aug): R12 800',
      'Expenses (Aug): R9 450',
      'Net: R3 350'
    ],
    quest: 'Enable 10% auto‑save on payday',
    cta: { label: 'View Transactions', link: '/transactions' },
  },

  // Large Apartments → Library (learning insights)
  Large_Apartments: {
    icon: <GiArchiveResearch className="text-indigo-500" />,
    label: 'Library',
    kpis: [
      'Lessons completed: 8',
      'Quiz average: 84%',
      'Learning streak: 5 days'
    ],
    quest: 'Finish 1 module this week → +100 XP',
    cta: { label: 'Continue Learning', link: '/learn' },
  },

  // Food market → food transactions & budgets
  Building_F003: {
    icon: <GiHouse className="text-amber-500" />,
    label: 'Food Market',
    kpis: [
      'Spend MTD: R2 150 / Budget: R2 500',
      'Avg basket: R185',
      'Visits this week: 6'
    ],
    quest: 'Cut groceries by 10% this week → +50 XP',
    cta: { label: 'Manage Groceries', link: '/budgets?c=groceries' },
  },

  // Residences → home & personal care stats
  Building_G004: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Residences',
    kpis: [
      'Home expenses MTD: R1 280',
      'Personal care MTD: R430',
      'Home % of income: 31%'
    ],
    quest: 'Reduce utilities by 8% this month → +40 XP',
    cta: { label: 'Tune Home & Care', link: '/budgets?c=home,personal' },
  },
  Building_G005: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Residences',
    kpis: [
      'Home expenses MTD: R1 180',
      'Personal care MTD: R390',
      'Trend: −3% vs last month'
    ],
    quest: 'Add R150 to home repairs fund',
    cta: { label: 'Top Up Repairs', link: '/goals?tag=repairs' },
  },
  Building_G001: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Residences',
    kpis: [
      'Utilities avg/day: R28',
      'Water usage: +2%',
      'Energy: off‑peak 3/7 days'
    ],
    quest: 'Hit 4 off‑peak days this week',
    cta: { label: 'Utilities Tips', link: '/learn/utilities' },
  },

  // Civic offices → goal stats
  Office_2: {
    icon: <GiPoliceBadge className="text-sky-500" />,
    label: 'Civic Offices',
    kpis: [
      'Active goals: 4',
      'Completion rate: 63%',
      'Streak: 3 weeks'
    ],
    quest: 'Increase auto‑contribution by R100 to finish sooner',
    cta: { label: 'Manage Goals', link: '/goals' },
  },

  // Police station → anomalies / impulse / over‑budget warnings
  Building_D001: {
    icon: <GiPoliceBadge className="text-cyan-600" />,
    label: 'Police Station',
    kpis: [
      'Anomalies flagged: 2',
      'Impulse buys (7d): 3',
      'Over budget cats: 1'
    ],
    quest: 'Review flagged transactions & set spend alerts',
    cta: { label: 'Review Anomalies', link: '/insights/anomalies' },
  },

  // Hotel → lifestyle (entertainment & subscriptions)
  Building_B001: {
    icon: <GiWoodenSign className="text-rose-500" />,
    label: 'Hotel',
    kpis: [
      'Lifestyle MTD: R980',
      'Entertainment: R640',
      'Subscriptions: R340'
    ],
    quest: 'Cancel 1 unused subscription → +35 XP',
    cta: { label: 'Manage Lifestyle', link: '/budgets?c=lifestyle' },
  },

  // Café → community insights & friends
  BARRA_CAFE_AL_PASO: {
    icon: <GiCoffeeCup className="text-amber-600" />,
    label: 'Café',
    kpis: [
      'Friends active (7d): 11',
      'Challenges joined: 2',
      'Likes on posts: 19'
    ],
    quest: 'Invite 2 friends to a savings challenge',
    cta: { label: 'Open Community', link: '/community' },
  },
}

/* ===========================
   Game-style Modal
=========================== */
function GameModal({ open, onClose, label, icon, kpis = [], quest, cta }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-[680px] rounded-2xl shadow-2xl overflow-hidden border border-white/70">
        <div className="bg-[#2b2f3a] text-white flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Stable
            </span>
            <span className="hidden sm:inline text-white/70">Status</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10"><FaTimes /></button>
        </div>
        <div className="bg-gradient-to-br from-[#3a3f4b] to-[#2b2f3a] text-white px-5 py-4">
          <div className="text-xs text-white/60 uppercase tracking-wider">District</div>
          <div className="flex items-center gap-2 text-xl font-bold leading-none">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/10">
              {icon ?? <GiAirBalloon />}
            </span>
            {label || 'Building'}
          </div>
        </div>
        <div className="bg-[#f6f3ea] px-4 sm:px-5 py-5">
          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-wide text-black/60 mb-2">Snapshot</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(kpis.length ? kpis : ['—', '—', '—']).slice(0, 3).map((v, i) => (
                <div key={i} className="rounded-lg bg-white border border-black/5 shadow px-3 py-3 text-sm text-black/70">{v}</div>
              ))}
            </div>
          </div>
          {quest && (
            <div className="mb-5 rounded-lg bg-white shadow border border-black/5 p-3">
              <div className="text-[11px] uppercase tracking-wide text-black/60 mb-1">Quest</div>
              <div className="text-sm">{quest}</div>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-black/10 text-gray-700 hover:bg-black/5">Close</button>
            <a href={cta?.link || '#'} onClick={onClose} className="px-4 py-2 rounded-xl bg-[#0ea5e9] text-white hover:bg-[#0284c7] shadow">
              {cta?.label || 'Manage'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===========================
   Beacon
=========================== */
function Beacon({ label, onClick }) {
  return (
    <div className="relative cursor-pointer select-none" onClick={onClick} onPointerDown={(e) => e.stopPropagation()}>
      <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-sky-500 shadow" />
      <div className="pl-6 pr-3 py-1 rounded-full bg-white/90 border border-gray-100 shadow text-[11px] font-medium text-gray-700">
        {label}
      </div>
    </div>
  )
}

/* ===========================
   Lighting rig (manual suns)
=========================== */
function LightingRig({ settings, showHelpers = false }) {
  const mainRef = useRef()
  const fillRef = useRef()
  useHelper(showHelpers && mainRef, THREE.DirectionalLightHelper, 4, 'orange')
  useHelper(showHelpers && fillRef, THREE.DirectionalLightHelper, 3, 'cyan')

  return (
    <>
      <directionalLight
        ref={mainRef}
        position={settings.sunMain.pos}
        color={settings.sunMain.color}
        intensity={settings.sunMain.intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-camera-left={-140}
        shadow-camera-right={140}
        shadow-camera-top={140}
        shadow-camera-bottom={-140}
        shadow-bias={-0.0006}
      />
      <directionalLight
        ref={fillRef}
        position={settings.sunFill.pos}
        color={settings.sunFill.color}
        intensity={settings.sunFill.intensity}
        castShadow={false}
      />
      <hemisphereLight
        color={settings.hemi.sky}
        groundColor={settings.hemi.ground}
        intensity={settings.hemi.intensity}
      />
      <ambientLight color={settings.ambient.color} intensity={settings.ambient.intensity} />
    </>
  )
}

/* ===========================
   Renderer / tone mapping
=========================== */
function RendererTuning({ exposure }) {
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

/* ===========================
   City model (with crash guards)
=========================== */
function CityModel({ onPick, hideBeacons, useGltfLights = false }) {
  const gltf = useGLTF('/Classic_Day_City.glb')
  const scene = gltf?.scene   // UPDATED: safe access
  const hasScene = !!scene && typeof scene.traverse === 'function'
  const [targets, setTargets] = useState([])

  useEffect(() => {
    if (!hasScene) return // UPDATED: guard against undefined

    // Disable/enable GLB lights to avoid double lighting
    scene.traverse((o) => {
      if (o.isLight) {
        if (useGltfLights) {
          o.intensity = Math.min(o.intensity ?? 1, 1.0)
        } else {
          o.intensity = 0
          if (o.parent) o.parent.remove(o)
        }
      }
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (!m) return
          m.metalness = 0
          m.roughness = 0.5
          m.envMapIntensity = 0
          m.flatShading = true
          m.needsUpdate = true
        })
      }
    })
  }, [hasScene, scene, useGltfLights])

  useEffect(() => {
    if (!hasScene) return // UPDATED: guard

    const isExcluded = (name) => EXCLUDED_PREFIXES.some((p) => name.startsWith(p))
    const baseKeyFor = (name) => {
      const m = name.match(/^Building_[A-Z]\d{3}/)
      if (m) return m[0]
      if (EXTRA_BUILDING_KEYS.has(name)) return name
      return null
    }

    const groups = new Map()
    scene.updateMatrixWorld(true)
    scene.traverse((o) => {
      if (!o.isMesh || !o.geometry) return
      const { name } = o
      if (isExcluded(name)) return
      const key = baseKeyFor(name)
      if (!key) return
      const box = new THREE.Box3().setFromObject(o)
      const entry = groups.get(key)
      if (!entry) groups.set(key, { label: FRIENDLY_LABELS[key] || pretty(key), boxes: [box] })
      else entry.boxes.push(box)
    })

    const result = []
    groups.forEach(({ label, boxes }, key) => {
      if (!boxes.length) return
      const merged = boxes.reduce((acc, b) => acc.union(b), new THREE.Box3().copy(boxes[0]))
      const center = new THREE.Vector3()
      merged.getCenter(center)
      const offset = OFFSETS_BY_KEY[key] ?? BEACON_OFFSET_Y
      center.y = merged.max.y + offset
      result.push({ key, label, position: center })
    })
    setTargets(result)
  }, [hasScene, scene])

  // Dev helper (safe)
  useEffect(() => {
    if (!hasScene) return
    window.__listMeshNames = () => {
      const names = new Set()
      scene.traverse((o) => o.isMesh && names.add(o.name))
      console.table([...names])
    }
  }, [hasScene, scene])

  return (
    <group>
      {hasScene ? (
        <>
          <primitive object={scene} />
          {!hideBeacons && targets.map((t) => (
            <Html key={t.key} center position={[t.position.x, t.position.y, t.position.z]} distanceFactor={12} zIndexRange={[100, 0]}>
              <Beacon label={t.label} onClick={() => onPick(t)} />
            </Html>
          ))}
        </>
      ) : null}
    </group>
  )
}

/* ===========================
   Light control panel
=========================== */
function LightPanel({ mode, setMode, sun, setSun, useGltfLights, setUseGltfLights }) {
  return (
    <div className="fixed top-4 right-4 z-[10000] bg-white/90 backdrop-blur rounded-xl shadow border border-gray-200 px-3 py-2 text-xs text-gray-800 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">Lighting</span>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={useGltfLights} onChange={e => setUseGltfLights(e.target.checked)} />
          <span>Use GLB Lights</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-2 py-1 rounded ${mode === 'day' ? 'bg-sky-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setMode('day')}
        >Day</button>
        <button
          className={`px-2 py-1 rounded ${mode === 'night' ? 'bg-slate-700 text-white' : 'bg-gray-100'}`}
          onClick={() => setMode('night')}
        >Night</button>
      </div>

      {['sunMain', 'sunFill'].map((k) => (
        <div key={k} className="space-y-1">
          <div className="mt-1 font-medium">{k === 'sunMain' ? 'Main Sun' : 'Fill Sun'}</div>
          <div className="grid grid-cols-3 gap-1">
            {['x', 'y', 'z'].map((axis, i) => (
              <label key={axis} className="flex items-center gap-1">
                <span className="w-3 uppercase">{axis}</span>
                <input
                  type="range" min={-150} max={150} step={1}
                  value={sun[k].pos[i]}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    const next = { ...sun }
                    next[k] = { ...sun[k], pos: [...sun[k].pos] }
                    next[k].pos[i] = v
                    setSun(next)
                  }}
                />
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span>Intensity</span>
            <input
              type="range" min={0} max={3} step={0.05}
              value={sun[k].intensity}
              onChange={(e) => {
                const next = { ...sun }
                next[k] = { ...sun[k], intensity: Number(e.target.value) }
                setSun(next)
              }}
            />
          </label>
          <label className="flex items-center gap-2">
            <span>Color</span>
            <input
              type="color"
              value={sun[k].color}
              onChange={(e) => {
                const next = { ...sun }
                next[k] = { ...sun[k], color: e.target.value }
                setSun(next)
              }}
            />
          </label>
        </div>
      ))}
    </div>
  )
}

/* ===========================
   Viewer shell
=========================== */
export default function CityViewer() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const [mode, setMode] = useState('day')
  const [useGltfLights, setUseGltfLights] = useState(false)

  const base = mode === 'day' ? DAY_LIGHT : NIGHT_LIGHT
  const [sun, setSun] = useState({
    sunMain: { ...base.sunMain },
    sunFill: { ...base.sunFill },
  })
  useEffect(() => {
    const b = mode === 'day' ? DAY_LIGHT : NIGHT_LIGHT
    setSun({ sunMain: { ...b.sunMain }, sunFill: { ...b.sunFill } })
  }, [mode])

  const lightingSettings = useMemo(() => ({
    sunMain: sun.sunMain,
    sunFill: sun.sunFill,
    hemi: (mode === 'day' ? DAY_LIGHT : NIGHT_LIGHT).hemi,
    ambient: (mode === 'day' ? DAY_LIGHT : NIGHT_LIGHT).ambient,
    exposure: (mode === 'day' ? DAY_LIGHT : NIGHT_LIGHT).exposure,
  }), [sun, mode])

  const openModalFor = (target) => {
    const binding = BUILDING_BINDINGS[target.key] || {
      icon: <GiAirBalloon className="text-sky-400" />,
      label: target.label,
      kpis: ['MTD vs Budget: —', 'Avg transaction: —', 'Trend: —'],
      quest: 'Complete a mini-goal this week to earn XP',
      cta: { label: 'Manage', link: '#' },
    }
    setSelected(binding)
    setOpen(true)
  }

  return (
    <div className="w-full h-screen bg-[#f2f5f8]">
      <GameModal
        open={open}
        label={selected?.label}
        icon={selected?.icon}
        kpis={selected?.kpis}
        quest={selected?.quest}
        cta={selected?.cta}
        onClose={() => setOpen(false)}
      />

      <LightPanel
        mode={mode}
        setMode={setMode}
        sun={sun}
        setSun={setSun}
        useGltfLights={useGltfLights}
        setUseGltfLights={setUseGltfLights}
      />

      <Canvas
        shadows
        camera={{ position: [-40, 40, 100], fov: 45 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = lightingSettings.exposure
          if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <RendererTuning exposure={lightingSettings.exposure} />
        <Suspense fallback={null}>
          <LightingRig settings={lightingSettings} showHelpers={false} />
          <CityModel hideBeacons={open} onPick={openModalFor} useGltfLights={useGltfLights} />
        </Suspense>

        <OrbitControls
          enableDamping
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 3}
          minDistance={16}
          maxDistance={16}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
