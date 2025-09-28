// CityViewer.jsx — THEMED GLB SWAP (6 scenes) + beacons + rich modal + collapsible panel
import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Html, useGLTF, useAnimations } from '@react-three/drei'

import {
  GiBank, GiHospitalCross, GiCoffeeCup, GiPoliceBadge, GiHouse, GiArchiveResearch,
} from 'react-icons/gi'
import {
  FaCoins, FaBolt, FaUsers, FaChartLine, FaHeartbeat, FaBook, FaUtensils,
  FaHome, FaShieldAlt, FaGem, FaStar, FaRegStar, FaBell,
  FaPalette
} from 'react-icons/fa'
import { FiSliders, FiX, FiChevronDown, FiMove } from 'react-icons/fi'

// Classic Day
import bankClassic from '../../assets/Building Images/Classic Day/bank.png';
import hospitalClassic from '../../assets/Building Images/Classic Day/hospital.png';
import foodMarketClassic from '../../assets/Building Images/Classic Day/food-market.png';
import policeStationClassic from '../../assets/Building Images/Classic Day/police-station.png';
import homeResidenceClassic from '../../assets/Building Images/Classic Day/residence.png';
import hotelClassic from '../../assets/Building Images/Classic Day/hotel.png';
import libraryClassic from '../../assets/Building Images/Classic Day/library.png';
import civicOfficesClassic from '../../assets/Building Images/Classic Day/civic-offices.png';
import cafeClassic from '../../assets/Building Images/Classic Day/cafe.png';

// Foggy Morning
import bankFoggy from '../../assets/Building Images/Foggy Morning/bank.png';
import hospitalFoggy from '../../assets/Building Images/Foggy Morning/hospital.png';
import foodMarketFoggy from '../../assets/Building Images/Foggy Morning/food-market.png';
import policeStationFoggy from '../../assets/Building Images/Foggy Morning/police-station.png';
import homeResidenceFoggy from '../../assets/Building Images/Foggy Morning/residence.png';
import hotelFoggy from '../../assets/Building Images/Foggy Morning/hotel.png';
import libraryFoggy from '../../assets/Building Images/Foggy Morning/library.png';
import civicOfficesFoggy from '../../assets/Building Images/Foggy Morning/civic-offices.png';
import cafeFoggy from '../../assets/Building Images/Foggy Morning/cafe.png';

// Golden Hour
import bankGolden from '../../assets/Building Images/Golden Hour/bank.png';
import hospitalGolden from '../../assets/Building Images/Golden Hour/hospital.png';
import foodMarketGolden from '../../assets/Building Images/Golden Hour/food-market.png';
import policeStationGolden from '../../assets/Building Images/Golden Hour/police-station.png';
import homeResidenceGolden from '../../assets/Building Images/Golden Hour/residence.png';
import hotelGolden from '../../assets/Building Images/Golden Hour/hotel.png';
import libraryGolden from '../../assets/Building Images/Golden Hour/library.png';
import civicOfficesGolden from '../../assets/Building Images/Golden Hour/civic-offices.png';
import cafeGolden from '../../assets/Building Images/Golden Hour/cafe.png';

// Neon Night
import bankNeon from '../../assets/Building Images/Neon Night/bank.png';
import hospitalNeon from '../../assets/Building Images/Neon Night/hospital.png';
import foodMarketNeon from '../../assets/Building Images/Neon Night/food-market.png';
import policeStationNeon from '../../assets/Building Images/Neon Night/police-station.png';
import homeResidenceNeon from '../../assets/Building Images/Neon Night/residence.png';
import hotelNeon from '../../assets/Building Images/Neon Night/hotel.png';
import libraryNeon from '../../assets/Building Images/Neon Night/library.png';
import civicOfficesNeon from '../../assets/Building Images/Neon Night/civic-offices.png';
import cafeNeon from '../../assets/Building Images/Neon Night/cafe.png';

// Rainy Evening
import bankRainy from '../../assets/Building Images/Rainy Evening/bank.png';
import hospitalRainy from '../../assets/Building Images/Rainy Evening/hospital.png';
import foodMarketRainy from '../../assets/Building Images/Rainy Evening/food-market.png';
import policeStationRainy from '../../assets/Building Images/Rainy Evening/police-station.png';
import homeResidenceRainy from '../../assets/Building Images/Rainy Evening/residence.png';
import hotelRainy from '../../assets/Building Images/Rainy Evening/hotel.png';
import libraryRainy from '../../assets/Building Images/Rainy Evening/library.png';
import civicOfficesRainy from '../../assets/Building Images/Rainy Evening/civic-offices.png';
import cafeRainy from '../../assets/Building Images/Rainy Evening/cafe.png';

// Sunset Pink
import bankSunset from '../../assets/Building Images/Sunset Pink/bank.png';
import hospitalSunset from '../../assets/Building Images/Sunset Pink/hospital.png';
import foodMarketSunset from '../../assets/Building Images/Sunset Pink/food-market.png';
import policeStationSunset from '../../assets/Building Images/Sunset Pink/police-station.png';
import homeResidenceSunset from '../../assets/Building Images/Sunset Pink/residence.png';
import hotelSunset from '../../assets/Building Images/Sunset Pink/hotel.png';
import librarySunset from '../../assets/Building Images/Sunset Pink/library.png';
import civicOfficesSunset from '../../assets/Building Images/Sunset Pink/civic-offices.png';
import cafeSunset from '../../assets/Building Images/Sunset Pink/cafe.png';


/* ===========================
   YOUR THEMED CITY SCENES (swap GLBs)
   Put files in /public/models/ and adjust paths if needed.
=========================== */
const CITY_SCENES = {
  classic_day: { name: 'Classic Day', single: '/models/Classic_Day_City.glb' },
  foggy_morning: { name: 'Foggy Morning', single: '/models/Foggy_Morning_City.glb' },
  golden_hour: { name: 'Golden Hour', single: '/models/Golden_Hour_City.glb' },
  neon_night: { name: 'Neon Night', single: '/models/Neon_Night_City.glb' },
  rainy_evening: { name: 'Rainy Evening', single: '/models/Rainy_Evening_City.glb' },
  sunset_pink: { name: 'Sunset Pink', single: '/models/Sunset_Pink_City.glb' },
}

// --- Add near the top, below CITY_SCENES ---
const THEME_PRESETS = {
  classic_day: {
    exposure: 1.1,
    bg: '#f0f5ff',
    fog: null,
    rain: false
  },

  foggy_morning: {
    exposure: 0.85,
    bg: '#d0d8e0',
    fog: {
      type: 'exp2',
      color: '#b8c5d5',
      density: 0.045
    },
    rain: false
  },

  golden_hour: {
    exposure: 1.2,
    bg: '#ffebd6',
    fog: { type: 'linear', color: '#ffd6b3', near: 100, far: 300 },
    rain: false
  },

  // ENHANCED NEON NIGHT - DARKER FOR BETTER EMISSION CONTRAST
  neon_night: {
    exposure: 0.6,  // Lower exposure for more dramatic neon
    bg: '#050520',  // Darker background
    fog: { type: 'exp2', color: '#0a0a2a', density: 0.008 }, // Less fog to see emissions better
    rain: false
  },

  rainy_evening: {
    exposure: 0.5,
    bg: '#a8b0b8',
    fog: {
      type: 'linear',
      color: '#8a98a8',
      near: 30,
      far: 150
    },
    rain: true,
    rainIntensity: 3.5  // Increased rain intensity
  },

  sunset_pink: {
    exposure: 1.15,
    bg: '#ffe6f0',
    fog: { type: 'linear', color: '#ffd6e0', near: 120, far: 320 },
    rain: false
  },
}

// Applies bg + fog whenever theme changes
function ThemeAtmosphere({ theme }) {
  const { scene, gl } = useThree()
  useEffect(() => {
    const preset = THEME_PRESETS[theme] || THEME_PRESETS.classic_day

    // Background
    scene.background = new THREE.Color(preset.bg)

    // Handle fog for all themes except those with EnhancedFog
    if (!['rainy_evening', 'foggy_morning'].includes(theme)) {
      if (preset.fog) {
        const c = new THREE.Color(preset.fog.color)
        if (preset.fog.type === 'exp2') {
          scene.fog = new THREE.FogExp2(c, preset.fog.density)
        } else {
          scene.fog = new THREE.Fog(c, preset.fog.near, preset.fog.far)
        }
      } else {
        scene.fog = null
      }
    }

    // Canvas clear color
    gl.setClearColor(scene.background, 1)
  }, [theme, scene, gl])

  return null
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
  if (t.day) useGLTF.preload(t.day)
  if (t.night) useGLTF.preload(t.night)
})

/* ===========================
   Small loader while a GLB streams
=========================== */
function Loader() {
  return (
    <Html center>
      <div className="px-3 py-2 rounded-lg bg-white/90 border text-sm text-gray-700 shadow">
        Loading city…
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

  const userTier = JSON.parse(localStorage.getItem('user') || '{}').tier;

const THEME_UNLOCK_MAP = {
  Wood: ['classic_day'],
  Bronze: ['classic_day', 'foggy_morning'],
  Silver: ['classic_day', 'foggy_morning', 'golden_hour'],
  Gold: ['classic_day', 'foggy_morning', 'golden_hour', 'neon_night'],
  Platinum: ['classic_day', 'foggy_morning', 'golden_hour', 'neon_night', 'rainy_evening'],
  Diamond: ['classic_day', 'foggy_morning', 'golden_hour', 'neon_night', 'rainy_evening', 'sunset_pink']
};

const unlockedThemes = THEME_UNLOCK_MAP[userTier] || [];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-24 right-4 z-[10] px-3 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 shadow border border-black/10 backdrop-blur"
          aria-label="Open lighting panel"
        >
          <span className="inline-flex items-center gap-2"><FaPalette /> Themes</span>
        </button>
      )}

      {open && (
        <div className="fixed top-24 right-4 z-[700] w-[320px] rounded-2xl bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 shadow-xl border border-black/10 backdrop-blur">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="font-semibold">Scene Style</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
              <FiX />
            </button>
          </div>

          {/* Theme chips */}
              <div className="grid grid-cols-3 grid-rows-2 gap-3 px-3 pb-3">
  {Object.keys(CITY_SCENES).map((key) => {
    const isUnlocked = unlockedThemes.includes(key);
    const isSelected = theme === key;

    return (
      <button
  key={key}
  onClick={() => setTheme(key)} // Always clickable during dev
  disabled={false} // Always enabled for dev; use !isUnlocked in production
  className={`relative px-4 py-2 rounded-lg border text-sm font-medium shadow-sm transition-all duration-200
    ${isSelected ? 'bg-lime-600 text-white border-lime-600' :
      isUnlocked ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-lime-500 hover:shadow-md' :
      'bg-white/70 dark:bg-gray-700/70 border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-400 hover:shadow-sm'}
  `}
>
  {CITY_SCENES[key].name}
  {!isUnlocked && (
    <span className="absolute top-1 right-2 text-[10px] font-semibold text-red-500 bg-white dark:bg-gray-900 px-1 rounded">
      Locked
    </span>
  )}
</button>
    );
  })}
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

// Map building keys to their image sets by theme
const BUILDING_IMAGES_BY_THEME = {
  // Classic Day
  classic_day: {
    Building_E001: foodMarketClassic,
    Building_C001: bankClassic,
    Large_Apartments: libraryClassic,
    Building_F003: hospitalClassic,
    Building_G004: homeResidenceClassic,
    Building_G005: homeResidenceClassic,
    Building_G001: homeResidenceClassic,
    Office_2: civicOfficesClassic,
    Building_D001: policeStationClassic,
    Building_B001: hotelClassic,
    BARRA_CAFE_AL_PASO: cafeClassic,
  },
  // Foggy Morning
  foggy_morning: {
    Building_E001: foodMarketFoggy,
    Building_C001: bankFoggy,
    Large_Apartments: libraryFoggy,
    Building_F003: hospitalFoggy,
    Building_G004: homeResidenceFoggy,
    Building_G005: homeResidenceFoggy,
    Building_G001: homeResidenceFoggy,
    Office_2: civicOfficesFoggy,
    Building_D001: policeStationFoggy,
    Building_B001: hotelFoggy,
    BARRA_CAFE_AL_PASO: cafeFoggy,
  },
  // Golden Hour
  golden_hour: {
    Building_E001: foodMarketGolden,
    Building_C001: bankGolden,
    Large_Apartments: libraryGolden,
    Building_F003: hospitalGolden,
    Building_G004: homeResidenceGolden,
    Building_G005: homeResidenceGolden,
    Building_G001: homeResidenceGolden,
    Office_2: civicOfficesGolden,
    Building_D001: policeStationGolden,
    Building_B001: hotelGolden,
    BARRA_CAFE_AL_PASO: cafeGolden,
  },
  // Neon Night
  neon_night: {
    Building_E001: foodMarketNeon,
    Building_C001: bankNeon,
    Large_Apartments: libraryNeon,
    Building_F003: hospitalNeon,
    Building_G004: homeResidenceNeon,
    Building_G005: homeResidenceNeon,
    Building_G001: homeResidenceNeon,
    Office_2: civicOfficesNeon,
    Building_D001: policeStationNeon,
    Building_B001: hotelNeon,
    BARRA_CAFE_AL_PASO: cafeNeon,
  },
  // Rainy Evening
  rainy_evening: {
    Building_E001: foodMarketRainy,
    Building_C001: bankRainy,
    Large_Apartments: libraryRainy,
    Building_F003: hospitalRainy,
    Building_G004: homeResidenceRainy,
    Building_G005: homeResidenceRainy,
    Building_G001: homeResidenceRainy,
    Office_2: civicOfficesRainy,
    Building_D001: policeStationRainy,
    Building_B001: hotelRainy,
    BARRA_CAFE_AL_PASO: cafeRainy,
  },
  // Sunset Pink
  sunset_pink: {
    Building_E001: foodMarketSunset,
    Building_C001: bankSunset,
    Large_Apartments: librarySunset,
    Building_F003: hospitalSunset,
    Building_G004: homeResidenceSunset,
    Building_G005: homeResidenceSunset,
    Building_G001: homeResidenceSunset,
    Office_2: civicOfficesSunset,
    Building_D001: policeStationSunset,
    Building_B001: hotelSunset,
    BARRA_CAFE_AL_PASO: cafeSunset,
  },
};

// Fallback images if a specific theme image is missing
const FALLBACK_IMAGES = {
  Building_E001: foodMarketClassic,
  Building_C001: bankClassic,
  Large_Apartments: libraryClassic,
  Building_F003: hospitalClassic,
  Building_G004: homeResidenceClassic,
  Building_G005: homeResidenceClassic,
  Building_G001: homeResidenceClassic,
  Office_2: civicOfficesClassic,
  Building_D001: policeStationClassic,
  Building_B001: hotelClassic,
  BARRA_CAFE_AL_PASO: cafeClassic,
};

/* ========= Rich building bindings (modal content) -- overriden by the API later ========= */
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
    icon: <GiBank className="text-lime-500" />,
    label: 'Bank',
    description: 'Live income vs expense with net position and trends.',
    rating: 5,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Net', value: 'R3 350', icon: <FaCoins /> },
    effects: [
      { icon: <FaChartLine />, value: '+R12 800', label: 'Income', tone: 'pos' },
      { icon: <FaBolt />, value: '-R9 450', label: 'Expenses', tone: 'neg' },
      { icon: <FaBell />, value: '2', label: 'Alerts', tone: 'warn' },
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
      { icon: <FaBook />, value: '8', label: 'Lessons', tone: 'pos' },
      { icon: <FaChartLine />, value: '84%', label: 'Quiz avg', tone: 'pos' },
      { icon: <FaBolt />, value: '5', label: 'Day streak', tone: 'pos' },
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
      { icon: <FaBolt />, value: '-R320', label: 'Spend MTD', tone: 'neg' },
      { icon: <FaShieldAlt />, value: '62%', label: 'Health EF', tone: 'pos' },
    ],
    upgrade: { label: 'Improve score', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'View Health Finances', link: '/goals?tag=health' },
  },
  Building_G004: {
    icon: <FaHome className="text-indigo-400" />,
    label: 'Residence',
    description: 'Home & personal care spending overview.',
    rating: 3,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Home+Care MTD', value: 'R1 710', icon: <FaHome /> },
    effects: [
      { icon: <FaCoins />, value: 'R1 280', label: 'Home', tone: 'neg' },
      { icon: <FaCoins />, value: 'R430', label: 'Personal', tone: 'neg' },
      { icon: <FaChartLine />, value: '31%', label: 'Income share', tone: 'warn' },
    ],
    upgrade: { label: 'Reduce utilities', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Tune Home & Care', link: '/budgets?c=home,personal' },
  },
  Building_G005: {
    icon: <FaHome className="text-indigo-400" />,
    label: 'Residence',
    description: 'Track trend vs last month and top up repairs.',
    rating: 3,
    level: { current: 1, max: 3 },
    sizeLabel: '5×5',
    headline: { label: 'Trend', value: '−3%', icon: <FaChartLine /> },
    effects: [
      { icon: <FaCoins />, value: 'R1 180', label: 'Home', tone: 'neg' },
      { icon: <FaCoins />, value: 'R390', label: 'Personal', tone: 'neg' },
      { icon: <FaShieldAlt />, value: 'R150', label: 'Repairs top-up', tone: 'pos' },
    ],
    upgrade: { label: 'Top up fund', coins: 44, xp: 25, cost: '—' },
    cta: { label: 'Top Up Repairs', link: '/goals?tag=repairs' },
  },
  Building_G001: {
    icon: <FaHome className="text-indigo-400" />,
    label: 'Residence',
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
function GameModal({ open, onClose, data, theme }) {
  if (!open || !data) return null
  const {
    key, // Get the key directly from data
    icon,
    label,
    description,
    rating = 4,
    level = { current: 1, max: 3 },
    sizeLabel = '5×5',
    headline = { label: 'Profit', value: '—', icon: <FaCoins /> },
    effects = [],
    cta,
    upgrade
  } = data

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

  // GET THEMED IMAGE based on current theme and building key
  const getThemedImage = (buildingKey, currentTheme) => {
    const themeImages = BUILDING_IMAGES_BY_THEME[currentTheme] || {};
    return themeImages[buildingKey] || FALLBACK_IMAGES[buildingKey];
  };

  // Use the key directly from data instead of searching
  const themedImage = key ? getThemedImage(key, theme) : null;

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
              {/* the tooltip image */}
              <div className="h-40 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {themedImage ? (
                  <img
                    src={themedImage}
                    alt={label}
                    className="h-full w-full object-cover"
                    draggable="false"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl">
                    {icon}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Stars />
                <div className="text-[11px] text-gray-500"> {level.current}/{level.max}</div>
              </div>
              <div className="mt-1 text-[11px] text-gray-500"> {sizeLabel}</div>
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
                  <div key={i} className={`flex items-center gap-2 rounded-xl border shadow-sm px-3 py-2 bg-white ${e.tone === 'neg' ? 'border-rose-200' : e.tone === 'warn' ? 'border-amber-200' : 'border-emerald-200'
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===========================
   Animated Rain System for Rainy Evening - IMPROVED VERSION
=========================== */
function RainSystem({ intensity = 1.0 }) {
  const rainRef = useRef()
  // OPTIMIZATION: Reduced rain count for better performance
  const rainCount = Math.floor(500 * intensity) // Reduced from 600 to 300

  useFrame((state, delta) => {
    if (!rainRef.current) return

    rainRef.current.children.forEach((drop, i) => {
      // SIGNIFICANTLY increased falling speed - multiplied by 200 instead of 80
      drop.position.y -= (2.0 + Math.random() * 3.0) * 200 * delta * intensity

      // Slight horizontal movement for wind effect
      drop.position.x += Math.sin(state.clock.elapsedTime * 3 + i) * 0.3 * intensity
      drop.position.z += Math.cos(state.clock.elapsedTime * 2 + i) * 0.2 * intensity

      // Reset when drop falls below ground
      if (drop.position.y < -10) {
        drop.position.y = 100 + Math.random() * 80  // Increased starting height for longer fall
        drop.position.x = Math.random() * 120 - 60
        drop.position.z = Math.random() * 120 - 60
      }
    })
  })

  return (
    <group ref={rainRef}>
      {Array.from({ length: rainCount }).map((_, i) => (
        <mesh
          key={`rain-${i}`}
          position={[
            Math.random() * 120 - 60,
            Math.random() * 100 + 50,  // Higher starting position
            Math.random() * 120 - 60
          ]}
        >
          <cylinderGeometry args={[0.05, 0.05, 2.0, 4]} />
          <meshBasicMaterial color="#e0f0ff" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function HeavyRainSystem({ intensity = 1.0 }) {
  return (
    <>
      {/* OPTIMIZATION: Use fewer layers but increase particle counts */}
      <RainSystem intensity={intensity} />
      
      {/* High-altitude particle layer - OPTIMIZED: Use instancing for better performance */}
      <RainParticles 
        count={Math.floor(4000 * intensity)} 
        intensity={intensity}
        area={300}
        heightRange={[50, 200]}
        size={0.6}
        opacity={0.4}
      />
      
      {/* Mid-distance particle layer */}
      <RainParticles 
        count={Math.floor(2000 * intensity)} 
        intensity={intensity}
        area={200}
        heightRange={[30, 150]}
        size={0.4}
        opacity={0.3}
        position={[0, 20, 0]}
      />
    </>
  )
}

// OPTIMIZED: Separate component using buffer geometry for better performance
function RainParticles({ 
  count, 
  intensity, 
  area = 200, 
  heightRange = [50, 200], 
  size = 0.6, 
  opacity = 0.5,
  position = [0, 0, 0] 
}) {
  const pointsRef = useRef()
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * area
      pos[i + 1] = Math.random() * (heightRange[1] - heightRange[0]) + heightRange[0]
      pos[i + 2] = (Math.random() - 0.5) * area
    }
    return pos
  })

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array
    const speed = 150 * intensity // Faster falling speed
    
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= speed * delta * (0.8 + Math.random() * 0.4)
      
      // Reset when below ground
      if (positions[i] < -10) {
        positions[i] = Math.random() * (heightRange[1] - heightRange[0]) + heightRange[0]
        positions[i - 1] = (Math.random() - 0.5) * area
        positions[i + 1] = (Math.random() - 0.5) * area
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#c0e0ff"
        transparent
        opacity={opacity}
        sizeAttenuation={true}
      />
    </points>
  )
}
/* ===========================
   Enhanced Fog Component
=========================== */
function EnhancedFog({ color, near, far, density, type }) {
  const { scene } = useThree()

  useEffect(() => {
    const fogColor = new THREE.Color(color)

    if (type === 'exp2') {
      scene.fog = new THREE.FogExp2(fogColor, density)
    } else {
      scene.fog = new THREE.Fog(fogColor, near, far)
    }

    return () => {
      scene.fog = null
    }
  }, [scene, color, near, far, density, type])

  return null
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
function CityModel({ glbPath, onPick, hideBeacons, useGltfLights = true, theme }) {
  const gltf = useGLTF(glbPath)
  const scene = gltf?.scene
  const hasScene = !!scene && typeof scene.traverse === 'function'
  const [targets, setTargets] = useState([])

  // animation hook
  const { actions, names } = useAnimations(gltf.animations, scene)

  // Auto-play all animations
  useEffect(() => {
    if (names && names.length > 0) {
      console.log('Available animations:', names)
      names.forEach((name) => {
        if (actions[name]) {
          actions[name].play()
          console.log('Playing:', name)
        }
      })
    }
  }, [actions, names])

  // Materials + optional GLB lights adjustments (two-pass)
  useEffect(() => {
    if (!hasScene) return

    scene.traverse((o) => {
      if (o.isLight) {
        // We light from R3F, not GLB
        o.visible = !!useGltfLights
        o.intensity = useGltfLights ? Math.min(o.intensity ?? 1, 1.0) : 0
      }
      if (!o.isMesh) return

      o.castShadow = true
      o.receiveShadow = true

      const mats = Array.isArray(o.material) ? o.material : [o.material]
      mats.forEach((m) => {
        if (!m) return

        // Keep Blender's original material properties
        // Only enhance shadows and basic properties
        m.metalness = m.metalness ?? 0
        m.roughness = m.roughness ?? (o.name.startsWith('Cloud') ? 0.9 : 0.5)
        m.envMapIntensity = m.envMapIntensity ?? 0

        // Preserve Blender's emission settings - DON'T OVERRIDE
        if (theme === 'neon_night') {
          // For neon theme, slightly boost existing emissions if they exist
          if (m.emissive && m.emissiveIntensity > 0) {
            m.emissiveIntensity = Math.min(m.emissiveIntensity * 1.2, 2.0)
          }
        }

        m.needsUpdate = true
      })
    })
  }, [hasScene, scene, useGltfLights, theme])

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

// Classic Day Light Rig
function BrightDayRig() {
  return (
    <>
      {/* soft sky tint (like Blender World) */}
      <hemisphereLight
        skyColor={'#fff4e6'}           // warm sky
        groundColor={'#d9c3a8'}        // warm ground bounce
        intensity={0.55}
      />

      {/* KEY SUN — warm, high right (≈ your top-right Sun in Blender) */}
      <directionalLight
        color={'#FFD4B8'}
        position={[90, 140, 70]}       // tweak these to taste
        intensity={2.4}                // Blender Strength ~9–10 maps ~2.0–2.8 here
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-camera-near={1}
        shadow-camera-far={400}
        shadow-bias={-0.0006}          // reduce acne
        shadow-normalBias={0.6}
      />

      {/* FILL/RIM SUN — cooler, lower left (your second Sun) */}
      <directionalLight
        color={'#BFD8FF'}
        position={[-70, 50, -40]}
        intensity={0.9}
        castShadow={false}             // fill usually doesn’t cast shadows
      />
    </>
  )
}

// Golden Hour Light Rig
function GoldenHourRig() {
  return (
    <>
      <hemisphereLight skyColor={'#ffd6b3'} groundColor={'#c79b78'} intensity={0.6} />
      {/* warmer, stronger key */}
      <directionalLight
        color={'#ff9a57'} position={[70, 80, 40]} intensity={2.6}
        castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096}
        shadow-camera-left={-120} shadow-camera-right={120} shadow-camera-top={120} shadow-camera-bottom={-120}
        shadow-camera-near={1} shadow-camera-far={400} shadow-bias={-0.00055} shadow-normalBias={0.6}
      />
      {/* pink fill to match your Blender rim */}
      <directionalLight color={'#ff6fa8'} position={[-48, 28, -32]} intensity={0.85} />
      <ambientLight intensity={0.16} />
    </>
  )
}

// Sunset Pink Light Rig
function SunsetPinkRig() {
  return (
    <>
      <hemisphereLight skyColor={'#ffd1e6'} groundColor={'#ffc2c9'} intensity={0.65} />
      <directionalLight
        color={'#ff8e62'} position={[82, 58, 28]} intensity={2.4}
        castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096}
        shadow-camera-left={-120} shadow-camera-right={120} shadow-camera-top={120} shadow-camera-bottom={120}
        shadow-bias={-0.00055} shadow-normalBias={0.6}
      />
      <directionalLight color={'#ff79bf'} position={[-52, 24, -28]} intensity={0.9} />
      <ambientLight intensity={0.15} />
    </>
  )
}

// Neon Night Light Rig 
function NeonNightRig() {
  return (
    <>
      {/* Very dark blue-purple ambient */}
      <hemisphereLight
        skyColor={'#0a0a2a'}
        groundColor={'#1a0a2a'}
        intensity={0.3}
      />

      {/* Blue moonlight from above */}
      <directionalLight
        color={'#4a7bff'}
        position={[40, 120, 20]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.001}
        shadow-normalBias={0.6}
      />

      {/* Purple fill light for contrast */}
      <directionalLight
        color={'#8a2be2'}
        position={[-30, 60, -40]}
        intensity={0.4}
        castShadow={false}
      />

      {/* Very low ambient to make emissions pop */}
      <ambientLight intensity={0.08} />
    </>
  )
}

// Foggy Night with Bright Lights Rig
function FoggyMorningRig() {
  return (
    <>
      {/* Darker night sky with subtle blue tones */}
      <hemisphereLight
        skyColor={'#1a2238'}
        groundColor={'#0a0f1c'}
        intensity={0.3}
      />

      {/* Bright, atmospheric key light mimicking artificial lights cutting through fog */}
      <directionalLight
        color={'#a0c8ff'}  // Cooler, brighter blue-white for night
        position={[40, 60, 40]}
        intensity={1.5}    // Increased intensity for light emission
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0005}
        shadow-normalBias={0.4}
      />

      {/* Additional fill lights to simulate light scattering in fog */}
      <directionalLight
        color={'#80a0e0'}
        position={[-30, 50, -30]}
        intensity={0.8}
        castShadow={false}
      />

      {/* Strong ambient to simulate light diffusion in fog */}
      <ambientLight intensity={0.7} color={'#304060'} />

      {/* Point lights for localized bright spots */}
      <pointLight
        color={'#c0e0ff'}
        position={[10, 15, 5]}
        intensity={3.2}
        distance={50}
        decay={2}
      />

      {/* Optional: Add more point lights for streetlight effect */}
      <pointLight
        color={'#e0f0ff'}
        position={[-15, 20, -10]}
        intensity={3.8}
        distance={40}
        decay={1.5}
      />
    </>
  )
}

// Rainy Evening Light Rig 
function RainyEveningRig() {
  return (
    <>
      <hemisphereLight
        skyColor={'#8a98a8'}  // Darker, more overcast
        groundColor={'#6a7888'}
        intensity={0.5}       // Reduced intensity for rainy darkness
      />

      {/* Cool, muted key light for rain */}
      <directionalLight
        color={'#a0a8b0'}     // Cooler, more muted
        position={[60, 90, 50]} // Lower position for overcast look
        intensity={1.0}       // Reduced intensity
        castShadow
        shadow-mapSize-width={1024} // Lower resolution for performance with rain
        shadow-mapSize-height={1024}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0002}
        shadow-normalBias={0.3}
      />

      <ambientLight intensity={0.3} /> {/* Slightly reduced ambient */}
    </>
  )
}

/* ===========================
   Viewer shell
=========================== */
export default function CityViewer() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [theme, setTheme] = useState('classic_day')
  const [mode, setMode] = useState('day')
  const [panelOpen, setPanelOpen] = useState(false)
  const [buildings, setBuildings] = useState([])

  const glbPath = getModelPath(theme, mode)
  const user = JSON.parse(localStorage.getItem('user'));

  // Map backend list -> lookup by id
  const buildingsById = useMemo(() => {
    const m = new Map();
    (buildings || []).forEach(b => m.set(b.id, b));
    return m;
  }, [buildings]);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch building data for the selected user
    const fetchBuildingData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/city/buildings/${user.id}`);
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error('Error fetching building data:', error);
      }
    };

    fetchBuildingData();
  }, [user]);

  // Tiny cleanup to avoid odd displays (no styling change)
  const normalizeValue = (v) => {
    if (typeof v !== 'string') return v;
    if (/^-R0\b/.test(v)) return v.slice(1);           // "-R0" -> "R0"
    if (/^-?\d+%$/.test(v)) {                           // clamp "267%" -> "100%"
      const n = parseInt(v, 10);
      const c = Math.max(0, Math.min(100, n));
      return `${c}%`;
    }
    return v;
  }

  // Non-destructive merge: keep styling/icons; only swap values from server
  const mergeBinding = (staticBinding, server) => {
    if (!server) return staticBinding;

    const merged = { ...staticBinding };

    if (server.headline && typeof server.headline.value === 'string') {
      merged.headline = { ...merged.headline, value: normalizeValue(server.headline.value) };
    }

    if (Array.isArray(merged.effects) && Array.isArray(server.effects)) {
      const byLabel = new Map(server.effects.map(e => [e.label, e]));
      merged.effects = merged.effects.map(e => {
        const s = byLabel.get(e.label);
        return s ? { ...e, value: normalizeValue(s.value) } : e;
        // icons/classes untouched to respect styling
      });
    }

    // Preserve the key if it exists in staticBinding
    if (staticBinding.key) {
      merged.key = staticBinding.key;
    }

    return merged;
  }

  // DEFINE openModalFor BEFORE it's used in the return statement
  const openModalFor = (target) => {
    const staticBinding = BUILDING_BINDINGS[target.key] || { label: target.label }
    const server = buildingsById.get(target.key)
    const merged = mergeBinding(staticBinding, server)

    // Add the building key to the merged data
    merged.key = target.key

    setSelected(merged)
    setOpen(true)
  }

  const preset = THEME_PRESETS[theme] || THEME_PRESETS.classic_day

  const Rig = {
    classic_day: BrightDayRig,
    golden_hour: GoldenHourRig,
    neon_night: NeonNightRig,
    foggy_morning: FoggyMorningRig,
    rainy_evening: RainyEveningRig,
    sunset_pink: SunsetPinkRig,
  }[theme] ?? BrightDayRig

  return (
    <div className="w-full h-screen bg-[#f2f5f8] dark:bg-[#0E171F]">
      <GameModal open={open} data={selected} onClose={() => setOpen(false)} theme={theme} />

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
          gl.toneMappingExposure = preset.exposure
          if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <RendererTuning exposure={preset.exposure} />
        <ThemeAtmosphere theme={theme} />

        {/* Enhanced Fog */}
        {preset.fog && (
          <EnhancedFog
            color={preset.fog.color}
            near={preset.fog.near}
            far={preset.fog.far}
            density={preset.fog.density}
            type={preset.fog.type}
          />
        )}

        {/* Rain System for Rainy Evening */}
        {preset.rain && (
          <>
            <HeavyRainSystem intensity={preset.rainIntensity || 1.5} />
          </>
        )}

        <Suspense fallback={<Loader />}>
          <CityModel
            glbPath={glbPath}
            hideBeacons={open}
            onPick={openModalFor}
            useGltfLights={false}
            theme={theme}
          />
        </Suspense>

        <Rig />

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

      {/* AR BUTTON */}
      <a
        href={`/ar?src=${encodeURIComponent(glbPath)}`}
        className="fixed top-24 left-4 z-[10] px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:bg-sky-700 border border-black/10"
      >
        View in AR
      </a>
    </div>
  )
}