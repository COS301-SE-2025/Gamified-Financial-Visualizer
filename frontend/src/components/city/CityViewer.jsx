// CityViewer.jsx — THEMED GLB SWAP (6 scenes) + beacons + rich modal + collapsible panel
import { useState, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Html, useGLTF, useProgress } from '@react-three/drei'

import {
  GiBank, GiHospitalCross, GiCoffeeCup, GiPoliceBadge, GiHouse, GiArchiveResearch, GiHotelBell
} from 'react-icons/gi'
import {
  FaCoins, FaBolt, FaUsers, FaChartLine, FaHeartbeat, FaBook, FaUtensils,
  FaHome, FaShieldAlt, FaGem, FaStar, FaRegStar, FaBell
} from 'react-icons/fa'
import { FiSliders, FiX, FiSun, FiMoon, FiChevronDown, FiMove } from 'react-icons/fi'

/* ===========================
   YOUR THEMED CITY SCENES (swap GLBs)
   Put files in /public/models/ and adjust paths if needed.
=========================== */
const CITY_SCENES = {
  classic_day:   { name: 'Classic Day',    single: '/models/Classic_Day_City.glb' },
  foggy_morning: { name: 'Foggy Morning',  single: '/models/Foggy_Morning_City.glb' },
  golden_hour:   { name: 'Golden Hour',    single: '/models/Golden_Hour_City.glb' },
  neon_night:    { name: 'Neon Night',     single: '/models/Neon_Night_City.glb' },
  rainy_evening: { name: 'Rainy Evening',  single: '/models/Rainy_Evening_City.glb' },
  sunset_pink:   { name: 'Sunset Pink',    single: '/models/Sunset_Pink_City.glb' },
}

// Helper: pick a path from a theme + mode
const getModelPath = (themeKey, mode) => {
  const t = CITY_SCENES[themeKey]
  if (!t) return ''
  // If a theme ever has day/night variants, use them; otherwise fall back to the single file.
  return (mode === 'night' ? t.night : t.day) || t.single || t.day || t.night || ''
}

// Preload all GLBs so switching is instant
Object.values(CITY_SCENES).forEach((t) => {
  if (t.single) useGLTF.preload(t.single)
  if (t.day)    useGLTF.preload(t.day)
  if (t.night)  useGLTF.preload(t.night)
})

/* ===========================
   Small loader while a GLB streams
=========================== */
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="px-3 py-2 rounded-lg bg-white/90 border text-sm text-gray-700 shadow">
        Loading city… {Math.round(progress)}%
      </div>
    </Html>
  )
}

/* ===========================
   Collapsible Theme Panel (6 themes + Day/Night)
=========================== */
function ThemePanel({ open, setOpen, theme, setTheme, mode, setMode }) {
  const themes = Object.keys(CITY_SCENES)
  const themeHasBoth = !!CITY_SCENES[theme]?.day && !!CITY_SCENES[theme]?.night

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-24 right-4 z-[10000] px-3 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 shadow border border-black/10 backdrop-blur"
          aria-label="Open lighting panel"
        >
          <span className="inline-flex items-center gap-2"><FiSliders/> Lighting & Theme</span>
        </button>
      )}

      {open && (
        <div className="fixed top-24 right-4 z-[10000] w-[320px] rounded-2xl bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 shadow-xl border border-black/10 backdrop-blur">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="font-semibold">Scene Style</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
              <FiX />
            </button>
          </div>

          {/* Day / Night (works; if theme is single, both map to same file) */}
          <div className="px-3 pb-2 flex items-center gap-2">
            <button
              onClick={() => setMode('day')}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-1 rounded-lg border ${
                mode==='day' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              }`}
              aria-disabled={!themeHasBoth && CITY_SCENES[theme]?.single}
            >
              <FiSun /> Day
            </button>
            <button
              onClick={() => setMode('night')}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-1 rounded-lg border ${
                mode==='night' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              }`}
              aria-disabled={!themeHasBoth && CITY_SCENES[theme]?.single}
            >
              <FiMoon /> Night
            </button>
          </div>

          {/* Theme chips */}
          <div className="px-3 pb-3 grid grid-cols-2 gap-2">
            {themes.map((key) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`px-3 py-2 rounded-xl border text-sm text-left shadow-sm ${
                  theme===key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                {CITY_SCENES[key].name}
              </button>
            ))}
          </div>

          <div className="px-3 pb-3 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiChevronDown /> Close to see the nav bar
          </div>
        </div>
      )}
    </>
  )
}

/* ===========================
   Drag/Scroll hint (auto-hides)
=========================== */
function ScrollHint() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const hide = () => setShow(false)
    const timers = [setTimeout(() => setShow(false), 5000)]
    window.addEventListener('pointerdown', hide, { once: true })
    window.addEventListener('wheel', hide, { once: true })
    window.addEventListener('touchstart', hide, { once: true })
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('pointerdown', hide)
      window.removeEventListener('wheel', hide)
      window.removeEventListener('touchstart', hide)
    }
  }, [])

  if (!show) return null
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[9000]">
      <div className="animate-pulse px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 border border-black/10 text-gray-700 dark:text-gray-200 shadow backdrop-blur flex items-center gap-2">
        <FiMove className="text-lg" />
        <span className="text-sm">Drag to explore the city</span>
      </div>
    </div>
  )
}

/* ===========================
   Beacon config
=========================== */
const BEACON_OFFSET_Y = 0.8
const OFFSETS_BY_KEY = {}
const pretty = (s) => s.replace(/[_\.]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
const EXTRA_BUILDING_KEYS = new Set(['Office_2', 'Large_Apartments', 'BARRA_CAFE_AL_PASO'])
const EXCLUDED_PREFIXES = [
  'Road_', 'Cloud', 'van', 'taxi', 'bus', 'pickup', 'sedan',
  'Fire_Hydrant', 'garbagebin', 'Mail_Box', 'Circle', 'Cube', 'Cylinder',
  'Plane', 'Text', 'Icosphere', 'Banner',
]
const FRIENDLY_LABELS = {
  Building_E001: 'Food Market',
  Building_C001: 'Bank',
  Large_Apartments: 'Library',
  Building_F003: 'Hospital',
  Building_G004: 'Residences',
  Building_G005: 'Residences',
  Building_G001: 'Residences',
  Office_2: 'Civic Offices',
  Building_D001: 'Police Station',
  Building_B001: 'Hotel',
  BARRA_CAFE_AL_PASO: 'Café',
}

/* ========= Rich building bindings (modal content) ========= */
const BUILDING_BINDINGS = {
  Building_E001: {
    icon: <GiHouse className="text-amber-500" />,
    label: 'Food Market',
    description: 'Groceries & takeout against your food budget.',
    rating: 4,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Budget left', value: 'R350', icon: <FaUtensils /> },
    effects: [
      { icon: <FaCoins />, value: 'R2 150', label: 'Spend MTD', tone: 'neg' },
      { icon: <FaCoins />, value: 'R2 500', label: 'Budget', tone: 'pos' },
      { icon: <FaChartLine />, value: '6', label: 'Visits (7d)', tone: 'warn' },
    ],
    upgrade: { label: 'Optimize basket', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Manage Groceries', link: '/budgets?c=groceries' },
  },
  Building_C001: {
    icon: <GiBank className="text-emerald-500" />,
    label: 'Bank',
    description: 'Live income vs expense with net position and trends.',
    rating: 5,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Net', value: 'R3 350', icon: <FaCoins /> },
    effects: [
      { icon: <FaChartLine />, value: '+R12 800', label: 'Income', tone: 'pos' },
      { icon: <FaBolt />,      value: '-R9 450',  label: 'Expenses', tone: 'neg' },
      { icon: <FaBell />,      value: '2',        label: 'Alerts', tone: 'warn' },
    ],
    upgrade: { label: 'Automate saving', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'View Transactions', link: '/transactions' },
  },
  Large_Apartments: {
    icon: <GiArchiveResearch className="text-indigo-500" />,
    label: 'Library',
    description: 'Boost knowledge with short lessons and quizzes to earn XP.',
    rating: 4,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'XP potential', value: '+100 XP', icon: <FaBook /> },
    effects: [
      { icon: <FaBook />,    value: '8',   label: 'Lessons', tone: 'pos' },
      { icon: <FaChartLine />, value: '84%', label: 'Quiz avg', tone: 'pos' },
      { icon: <FaBolt />,    value: '5',   label: 'Day streak', tone: 'pos' },
    ],
    upgrade: { label: 'Unlock module', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Continue Learning', link: '/learn' },
  },
  Building_F003: {
    icon: <GiHospitalCross className="text-red-400" />,
    label: 'Hospital',
    description: 'Track your financial health and risk. Keep your Health EF topped up.',
    rating: 4,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Health score', value: '72/100', icon: <FaHeartbeat /> },
    effects: [
      { icon: <FaCoins />, value: '+R0', label: 'Medical cashback', tone: 'pos' },
      { icon: <FaBolt />,  value: '-R320', label: 'Spend MTD', tone: 'neg' },
      { icon: <FaShieldAlt />, value: '62%', label: 'Health EF', tone: 'pos' },
    ],
    upgrade: { label: 'Improve score', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'View Health Finances', link: '/goals?tag=health' },
  },
  Building_G004: {
    icon: <FaHome className="text-indigo-400" />,
    label: 'Residences',
    description: 'Home & personal care spending overview.',
    rating: 3,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Home+Care MTD', value: 'R1 710', icon: <FaHome /> },
    effects: [
      { icon: <FaCoins />, value: 'R1 280', label: 'Home', tone: 'neg' },
      { icon: <FaCoins />, value: 'R430',  label: 'Personal', tone: 'neg' },
      { icon: <FaChartLine />, value: '31%', label: 'Income share', tone: 'warn' },
    ],
    upgrade: { label: 'Reduce utilities', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Tune Home & Care', link: '/budgets?c=home,personal' },
  },
  Building_G005: {
    icon: <FaHome className="text-indigo-400" />,
    label: 'Residences',
    description: 'Track trend vs last month and top up repairs.',
    rating: 3,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Trend', value: '−3%', icon: <FaChartLine /> },
    effects: [
      { icon: <FaCoins />, value: 'R1 180', label: 'Home', tone: 'neg' },
      { icon: <FaCoins />, value: 'R390',  label: 'Personal', tone: 'neg' },
      { icon: <FaShieldAlt />, value: 'R150', label: 'Repairs top-up', tone: 'pos' },
    ],
    upgrade: { label: 'Top up fund', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Top Up Repairs', link: '/goals?tag=repairs' },
  },
  Building_G001: {
    icon: <FaHome className="text-indigo-400" />,
    label: 'Residences',
    description: 'Daily utilities and off-peak usage.',
    rating: 3,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Avg/day', value: 'R28', icon: <FaBolt /> },
    effects: [
      { icon: <FaChartLine />, value: '+2%', label: 'Water', tone: 'warn' },
      { icon: <FaBolt />, value: '3/7', label: 'Off-peak days', tone: 'pos' },
      { icon: <FaShieldAlt />, value: 'Tips', label: 'Save energy', tone: 'pos' },
    ],
    upgrade: { label: 'Hit 4 off-peak', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Utilities Tips', link: '/learn/utilities' },
  },
  Office_2: {
    icon: <GiPoliceBadge className="text-sky-500" />,
    label: 'Civic Offices',
    description: 'All your active goals and completion rates.',
    rating: 4,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Completion', value: '63%', icon: <FaChartLine /> },
    effects: [
      { icon: <FaChartLine />, value: '4', label: 'Active goals', tone: 'pos' },
      { icon: <FaCoins />, value: '+R100', label: 'Auto-contrib', tone: 'pos' },
      { icon: <FaBolt />, value: '3w', label: 'Streak', tone: 'pos' },
    ],
    upgrade: { label: 'Boost auto-save', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Manage Goals', link: '/goals' },
  },
  Building_D001: {
    icon: <GiPoliceBadge className="text-cyan-600" />,
    label: 'Police Station',
    description: 'Anomalies, impulse buys and overspending warnings.',
    rating: 5,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Alerts', value: '2', icon: <FaBell /> },
    effects: [
      { icon: <FaBell />, value: '2', label: 'Anomalies', tone: 'warn' },
      { icon: <FaBolt />, value: '3', label: 'Impulse (7d)', tone: 'warn' },
      { icon: <FaCoins />, value: '1', label: 'Over-budget', tone: 'neg' },
    ],
    upgrade: { label: 'Tighten rules', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Review Anomalies', link: '/insights/anomalies' },
  },
  Building_B001: {
    icon: <FaBell className="text-rose-500" />,
    label: 'Hotel',
    description: 'Lifestyle, entertainment and subscription spending.',
    rating: 4,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Lifestyle MTD', value: 'R980', icon: <FaCoins /> },
    effects: [
      { icon: <FaCoins />, value: 'R640', label: 'Entertainment', tone: 'neg' },
      { icon: <FaCoins />, value: 'R340', label: 'Subscriptions', tone: 'neg' },
      { icon: <FaShieldAlt />, value: '1', label: 'Cancel target', tone: 'pos' },
    ],
    upgrade: { label: 'Trim subs', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Manage Lifestyle', link: '/budgets?c=lifestyle' },
  },
  BARRA_CAFE_AL_PASO: {
    icon: <GiCoffeeCup className="text-amber-600" />,
    label: 'Café',
    description: 'See friends, challenges and community momentum.',
    rating: 5,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Friends active', value: '11', icon: <FaUsers /> },
    effects: [
      { icon: <FaUsers />, value: '11', label: 'Active (7d)', tone: 'pos' },
      { icon: <FaChartLine />, value: '2', label: 'Challenges', tone: 'pos' },
      { icon: <FaCoins />, value: '19', label: 'Likes', tone: 'pos' },
    ],
    upgrade: { label: 'Invite friends', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Open Community', link: '/community' },
  },
}

/* ===========================
   Game-style Modal (hotel card look)
=========================== */
function GameModal({ open, onClose, data }) {
  if (!open || !data) return null
  const { icon, label, description, rating = 4, level = { current: 1, max: 3 }, sizeLabel = '5×5',
    headline = { label: 'Profit', value: '—', icon: <FaCoins /> }, effects = [], cta, upgrade } = data

  const Stars = () => {
    const full = Math.max(0, Math.min(5, Math.floor(rating)))
    const empty = 5 - full
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: full }).map((_, i) => <FaStar key={`s${i}`} className="text-yellow-400" />)}
        {Array.from({ length: empty }).map((_, i) => <FaRegStar key={`e${i}`} className="text-yellow-300" />)}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[95%] max-w-[900px] rounded-3xl overflow-hidden shadow-2xl border border-black/10">
        <div className="bg-gradient-to-b from-rose-400 to-rose-500 text-white px-5 py-3 flex items-center justify-between">
          <div className="text-lg font-extrabold tracking-wide">{label}</div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25">✕</button>
        </div>
        <div className="bg-[#f6f3ea] p-5">
          <div className="grid gap-4 md:grid-cols-[280px_1fr]">
            <div className="bg-white rounded-2xl border border-black/5 shadow p-3">
              <div className="h-40 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl">
                {icon}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Stars />
                <div className="text-[11px] text-gray-500">Уровень {level.current}/{level.max}</div>
              </div>
              <div className="mt-1 text-[11px] text-gray-500">Размер: {sizeLabel}</div>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{description}</p>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-amber-100 text-amber-600">
                  {headline.icon ?? <FaCoins />}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">{headline.label}</div>
                  <div className="text-2xl font-bold text-gray-800">{headline.value}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {effects.map((e, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-xl border shadow-sm px-3 py-2 bg-white ${
                    e.tone === 'neg' ? 'border-rose-200' : e.tone === 'warn' ? 'border-amber-200' : 'border-emerald-200'
                  }`}>
                    <span className="text-lg">{e.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{e.value}</div>
                      <div className="text-[11px] text-gray-500">{e.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-white rounded-2xl border border-black/5 shadow px-4 py-3">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <FaGem className="text-fuchsia-500" /><span className="font-semibold">{upgrade?.cost ?? 250}</span>
                    <span className="text-gray-500">premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCoins className="text-yellow-500" /><span className="font-semibold">{upgrade?.coins ?? 44}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                      +{upgrade?.xp ?? 25} XP
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={cta?.link || '#'} onClick={onClose} className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 shadow">
                    {cta?.label || 'Manage'}
                  </a>
                </div>
              </div>
            </div>
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
   Renderer tuning (neutral)
=========================== */
function RendererTuning({ exposure = 1.0 }) {
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
   City model (loads the selected GLB)
=========================== */
function CityModel({ glbPath, onPick, hideBeacons, useGltfLights = true }) {
  const gltf = useGLTF(glbPath)
  const scene = gltf?.scene
  const hasScene = !!scene && typeof scene.traverse === 'function'
  const [targets, setTargets] = useState([])

  // Materials + optional GLB lights adjustments (two-pass)
  useEffect(() => {
    if (!hasScene) return
    const lightsToRemove = []
    scene.traverse((o) => {
      if (o.isLight) {
        if (useGltfLights) { o.intensity = Math.min(o.intensity ?? 1, 1.0); o.visible = true }
        else { o.intensity = 0; o.visible = false; lightsToRemove.push(o) }
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
    if (!useGltfLights) lightsToRemove.forEach((l) => l.parent?.remove(l))
  }, [hasScene, scene, useGltfLights])

  // Group meshes into buildings & compute beacon positions
  useEffect(() => {
    if (!hasScene) return
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

  // Dev helper
  useEffect(() => {
    if (!hasScene) return
    window.__listMeshNames = () => {
      const names = new Set()
      scene?.traverse?.((o) => o.isMesh && names.add(o.name))
      console.table([...names])
    }
  }, [hasScene, scene])

  return (
    <group key={glbPath}>
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
   Viewer shell
=========================== */
export default function CityViewer() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const [theme, setTheme] = useState('classic_day') // one of CITY_SCENES keys
  const [mode, setMode]   = useState('day')         // 'day' | 'night' (if theme is single, both map to same file)
  const [panelOpen, setPanelOpen] = useState(false)

  const glbPath = getModelPath(theme, mode)

  const openModalFor = (target) => {
    const binding = BUILDING_BINDINGS[target.key] || { label: target.label }
    setSelected(binding)
    setOpen(true)
  }

  return (
    <div className="w-full h-screen bg-[#f2f5f8] dark:bg-[#0E171F]">
      <GameModal open={open} data={selected} onClose={() => setOpen(false)} />

      <ThemePanel
        open={panelOpen}
        setOpen={setPanelOpen}
        theme={theme}
        setTheme={setTheme}
        mode={mode}
        setMode={setMode}
      />

      <ScrollHint />

      <Canvas
        shadows
        camera={{ position: [-40, 40, 100], fov: 45 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0 // neutral; your GLB lights control the look
          if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <RendererTuning exposure={1.0} />
        <Suspense fallback={<Loader />}>
          <CityModel
            glbPath={glbPath}
            hideBeacons={open}
            onPick={openModalFor}
            useGltfLights={true}
          />
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
