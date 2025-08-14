// CityViewer.jsx
import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei'
import { Suspense } from 'react'
import {
  GiBank, GiHospitalCross, GiCoffeeCup, GiPoliceBadge, GiHouse, GiAirBalloon
} from 'react-icons/gi'
import { FaTimes } from 'react-icons/fa'

/* ===========================
   Config & helpers
=========================== */

// how high the tooltip floats above the roof
const BEACON_OFFSET_Y = 0.8
// fine-tune specific buildings if needed: { Building_E001: 0.6, ... }
const OFFSETS_BY_KEY = {}

const pretty = (s) =>
  s.replace(/[_\.]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

// Extra building groups that don’t match Building_*
const EXTRA_BUILDING_KEYS = new Set([
  'Office_2',
  'Large_Apartments',
  'BARRA_CAFE_AL_PASO', // café
])

// Ignore these prefixes
const EXCLUDED_PREFIXES = [
  'Road_', 'Cloud', 'van', 'taxi', 'bus', 'pickup', 'sedan',
  'Fire_Hydrant', 'garbagebin', 'Mail_Box', 'Circle', 'Cube', 'Cylinder',
  'Plane', 'Text', 'Icosphere', 'Banner',
]

// Nice display names: DO NOT CHANGE THIS
const FRIENDLY_LABELS = {
  Building_E001: 'Food Market',
  Building_F003: 'Hospital',
  Building_C001: 'Bank',
  Building_B001: 'Hotel',
  Building_D001: 'Police Station',
  Building_G004: 'Residences',
  Building_G005: 'Residences',
  Building_G001: 'Residences',
  Office_2: 'Civic Offices',
  Large_Apartments: 'Large Apartments',
  BARRA_CAFE_AL_PASO: 'Café',
}

// Per-building *gamified finance* content
// (You can wire live data later—these are copy-only for now.)
const BUILDING_BINDINGS = {
  Building_F003: {
    icon: <GiHouse className="text-amber-500" />,
    label: 'Food Market',
    kpis: [
      'Spend MTD: R2 150 / Budget: R2 500',
      'Avg basket: R185',
      'Visits this week: 6',
    ],
    quest: 'Cut groceries by 10% this week → +50 XP',
    cta: { label: 'Manage Groceries', link: '/budgets?c=groceries' },
  },
  BARRA_CAFE_AL_PASO: {
    icon: <GiCoffeeCup className="text-amber-600" />,
    label: 'Café',
    kpis: [
      'Coffees this week: 4',
      'MTD spend: R140',
      'Latte factor: R1 820/yr',
    ],
    quest: 'Skip 2 days & move R40 to savings → +20 XP',
    cta: { label: 'Tune Snack Cap', link: '/budgets?c=coffee' },
  },
  Building_E001: {
    icon: <GiHospitalCross className="text-red-400" />,
    label: 'Hospital',
    kpis: [
      'Premiums YTD: R5 600',
      'Out-of-pocket MTD: R320',
      'Health EF: 62% funded',
    ],
    quest: 'Top up health EF by R300 this month to reach 100% by Dec',
    cta: { label: 'Health Fund', link: '/goals?tag=health' },
  },
  Building_D001: {
    icon: <GiBank className="text-emerald-500" />,
    label: 'Main Offices',
    kpis: [
      'Last salary: R12 800 (3 Aug)',
      'Sources: 2',
      'Income stability: 88/100',
    ],
    quest: 'Set 10% auto-save on payday → +40 XP',
    cta: { label: 'Automate Saving', link: '/accounts/auto-save' },
  },
  Office_2: {
    icon: <GiPoliceBadge className="text-sky-500" />,
    label: 'Civic Offices',
    kpis: [
      'Policies reviewed: 1/3',
      'Premiums MTD: R640',
      'Claims YTD: 0',
    ],
    quest: 'Review car insurance—target R100/m saving → +30 XP',
    cta: { label: 'Review Policies', link: '/accounts/insurances' },
  },
  Building_C001: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Apartments',
    kpis: [
      'Rent: paid (due 1st)',
      'Utilities MTD: R430',
      'Housing % income: 31%',
    ],
    quest: 'Reduce utilities by 8% this month → +40 XP',
    cta: { label: 'Manage Housing Budget', link: '/budgets?c=housing' },
  },
  Building_G004: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Residences',
    kpis: [
      'Utilities MTD: R410',
      'Avg kWh/day: 10.8',
      'Water usage: 2% ↑',
    ],
    quest: '3 “off-peak” days this week → +25 XP',
    cta: { label: 'Utilities Tips', link: '/learn/utilities' },
  },
  Building_G005: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Residences',
    kpis: [
      'Repairs fund: R2 100',
      'Spend MTD: R220',
      '3-mo avg: R260',
    ],
    quest: 'Add R150 to repairs fund → +15 XP',
    cta: { label: 'Top Up Fund', link: '/goals?tag=repairs' },
  },
  Large_Apartments: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Large Apartments',
    kpis: [
      'Rent due in: 19 days',
      'Housing % income: 29%',
      'Avg utility bill: R520',
    ],
    quest: 'Schedule rent reminder & 5-day buffer → +10 XP',
    cta: { label: 'Set Reminder', link: '/support/reminders' },
  },
  Building_B001: {
    icon: <GiHouse className="text-indigo-400" />,
    label: 'Townhouses',
    kpis: [
      'Home fund: R4 000',
      'Spend MTD: R180',
      'Three quotes saved',
    ],
    quest: 'Lock in 2nd-hand furniture deal → +20 XP',
    cta: { label: 'View Deals', link: '/community/deals' },
  },
}

/* =============== Game-style Modal (KPIs + Quest) =============== */
function GameModal({ open, onClose, label, icon, kpis = [], quest, cta }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-[680px] rounded-2xl shadow-2xl overflow-hidden border border-white/70">
        {/* Top bar */}
        <div className="bg-[#2b2f3a] text-white flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Stable
            </span>
            <span className="hidden sm:inline text-white/70">Status</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10">
            <FaTimes />
          </button>
        </div>

        {/* Title */}
        <div className="bg-gradient-to-br from-[#3a3f4b] to-[#2b2f3a] text-white px-5 py-4">
          <div className="text-xs text-white/60 uppercase tracking-wider">District</div>
          <div className="flex items-center gap-2 text-xl font-bold leading-none">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/10">
              {icon ?? <GiAirBalloon />}
            </span>
            {label || 'Building'}
          </div>
        </div>

        {/* Body */}
        <div className="bg-[#f6f3ea] px-4 sm:px-5 py-5">
          {/* KPIs */}
          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-wide text-black/60 mb-2">Snapshot</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(kpis.length ? kpis : ['—','—','—']).slice(0,3).map((v, i) => (
                <div key={i} className="rounded-lg bg-white border border-black/5 shadow px-3 py-3 text-sm text-black/70">
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Quest */}
          {quest && (
            <div className="mb-5 rounded-lg bg-white shadow border border-black/5 p-3">
              <div className="text-[11px] uppercase tracking-wide text-black/60 mb-1">Quest</div>
              <div className="text-sm">{quest}</div>
            </div>
          )}

          {/* Footer */}
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
   Beacon (no pulsing)
=========================== */
function Beacon({ label, onClick }) {
  return (
    <div
      className="relative cursor-pointer select-none"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* solid dot only */}
      <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-sky-500 shadow" />
      <div className="pl-6 pr-3 py-1 rounded-full bg-white/90 border border-gray-100 shadow text-[11px] font-medium text-gray-700">
        {label}
      </div>
    </div>
  )
}

/* ===========================
   City model: group & place
=========================== */
function CityModel({ onPick, hideBeacons }) {
  const { scene } = useGLTF('/Classic_Day_City.glb')
  const [targets, setTargets] = useState([])

  // stylized look
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (!m) return
          m.metalness = 0
          m.roughness = 0.45
          m.envMapIntensity = 0
          m.flatShading = true
          m.needsUpdate = true
        })
      }
    })
  }, [scene])

  useEffect(() => {
    const isExcluded = (name) => EXCLUDED_PREFIXES.some((p) => name.startsWith(p))

    const baseKeyFor = (name) => {
      const m = name.match(/^Building_[A-Z]\d{3}/)
      if (m) return m[0]
      if (EXTRA_BUILDING_KEYS.has(name)) return name
      return null
    }

    const groups = new Map() // key -> { label, boxes: [] }
    scene.updateMatrixWorld(true)
    scene.traverse((o) => {
      if (!o.isMesh || !o.geometry) return
      const { name } = o
      if (isExcluded(name)) return
      const key = baseKeyFor(name)
      if (!key) return

      const box = new THREE.Box3().setFromObject(o)
      const entry = groups.get(key)
      if (!entry) {
        groups.set(key, { label: FRIENDLY_LABELS[key] || pretty(key), boxes: [box] })
      } else {
        entry.boxes.push(box)
      }
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
  }, [scene])

  // Dev helper
  useEffect(() => {
    window.__listMeshNames = () => {
      const names = new Set()
      scene.traverse((o) => o.isMesh && names.add(o.name))
      console.table([...names])
    }
  }, [scene])

  return (
    <group>
      <primitive object={scene} />
      {!hideBeacons && targets.map((t) => (
        <Html
          key={t.key}
          center
          position={[t.position.x, t.position.y, t.position.z]}
          distanceFactor={12}
          zIndexRange={[100, 0]}
        >
          <Beacon label={t.label} onClick={() => onPick(t)} />
        </Html>
      ))}
    </group>
  )
}

/* ===========================
   Viewer shell
=========================== */
export default function CityViewer() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const openModalFor = (target) => {
    // Pull binding (or fallback with friendly label)
    const binding = BUILDING_BINDINGS[target.key] || {
      icon: <GiAirBalloon className="text-sky-400" />,
      label: target.label,
      kpis: [
        'MTD vs Budget: —',
        'Avg transaction: —',
        'Trend: —',
      ],
      quest: 'Complete a mini-goal this week to earn XP',
      cta: { label: 'Manage', link: '#' },
    }
    setSelected(binding)
    setOpen(true)
  }

  return (
    <div className="w-full h-screen bg-[#f9f9f9]">
      <GameModal
        open={open}
        label={selected?.label}
        icon={selected?.icon}
        kpis={selected?.kpis}
        quest={selected?.quest}
        cta={selected?.cta}
        onClose={() => setOpen(false)}
      />

      <Canvas shadows camera={{ position: [-40, 40, 100], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 80, 100]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-30, 40, -50]} intensity={0.4} color="#fff8e7" />

        <Suspense fallback={null}>
          <CityModel hideBeacons={open} onPick={openModalFor} />
          <Environment preset="apartment" background={false} />
        </Suspense>

        <OrbitControls
          enableDamping
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 0}
          maxAzimuthAngle={Math.PI / 0}
          minDistance={16}
          maxDistance={16}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
