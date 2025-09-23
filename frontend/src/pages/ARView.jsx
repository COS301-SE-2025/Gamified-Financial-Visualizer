// src/pages/ARView.jsx
import { useMemo, useRef, useEffect, useState } from 'react';
import { FaBuilding, FaBullseye, FaCamera, FaCheck, FaGamepad, FaInfoCircle, FaMobileAlt, FaPhoneAlt, FaVideo } from 'react-icons/fa';
import { useSearchParams, Link } from 'react-router-dom';

// EXACT theme matching with CityViewer
const detectThemeFromPath = (glbPath) => {
  const path = glbPath.toLowerCase();
  if (path.includes('classic_day')) return 'classic_day';
  if (path.includes('foggy_morning')) return 'foggy_morning';
  if (path.includes('golden_hour')) return 'golden_hour';
  if (path.includes('neon_night')) return 'neon_night';
  if (path.includes('rainy_evening')) return 'rainy_evening';
  if (path.includes('sunset_pink')) return 'sunset_pink';
  return 'classic_day';
};

// PROVEN theme settings that match CityViewer exactly
const THEME_SETTINGS = {
  classic_day: {
    exposure: 1.0,
    environmentImage: 'neutral',
    bgColor: '#f0f5ff',
    arShadow: true,
    arPlacement: 'floor'
  },
  foggy_morning: {
    exposure: 0.8,
    environmentImage: 'neutral',
    bgColor: '#d0d8e0',
    arShadow: true,
    arPlacement: 'floor'
  },
  golden_hour: {
    exposure: 1.1,
    environmentImage: 'neutral',
    bgColor: '#ffebd6',
    arShadow: true,
    arPlacement: 'floor'
  },
  neon_night: {
    exposure: 0.7,
    environmentImage: 'none',
    bgColor: '#050520',
    arShadow: false,
    arPlacement: 'floor'
  },
  rainy_evening: {
    exposure: 0.75,
    environmentImage: 'neutral',
    bgColor: '#a8b0b8',
    arShadow: true,
    arPlacement: 'floor'
  },
  sunset_pink: {
    exposure: 1.05,
    environmentImage: 'neutral',
    bgColor: '#ffe6f0',
    arShadow: true,
    arPlacement: 'floor'
  },
};

// USDZ path mapping
const getUSDZPath = (glbPath) => {
  const theme = detectThemeFromPath(glbPath);
  const themeMap = {
    'classic_day': 'Classic_Day_City',
    'foggy_morning': 'Foggy_Morning_City',
    'golden_hour': 'Golden_Hour_City',
    'neon_night': 'Neon_Night_City',
    'rainy_evening': 'Rainy_Evening_City',
    'sunset_pink': 'Sunset_Pink_City'
  };
  return `/models/${themeMap[theme]}.usdz`;
};

function QRCode({ url, size = 200 }) {
  // Using a more reliable QR code generator
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col items-center">
      <img
        src={qrUrl}
        alt="Scan for AR Experience"
        className="rounded-xl border-4 border-white shadow-2xl"
        width={size}
        height={size}
      />
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 text-center">
        Scan with your phone's camera
      </p>
    </div>
  );
}



export default function ARView() {
  const [params] = useSearchParams();
  const glbSrc = decodeURIComponent(params.get('src') || '/models/Classic_Day_City.glb');
  const usdzSrc = getUSDZPath(glbSrc);

  const currentTheme = detectThemeFromPath(glbSrc);
  const themeSettings = THEME_SETTINGS[currentTheme];

  const mvRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);
  const [hasUSDZ, setHasUSDZ] = useState(false);
  const [arReady, setArReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [arStatus, setArStatus] = useState('initializing');

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/i.test(navigator.userAgent));
    checkUSDZExists(usdzSrc).then(setHasUSDZ);

    // Check WebXR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setArStatus(supported ? 'supported' : 'not-supported');
      });
    } else {
      setArStatus('not-supported');
    }
  }, [usdzSrc]);

  const checkUSDZExists = async (path) => {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleLoad = () => {
    const mv = mvRef.current;
    if (!mv) return;

    // Enhanced AR anchoring
    mv.arScale = 'fixed'; // Prevents model from moving
    mv.arPlacement = 'floor';
    mv.autoRotate = false;
    mv.interactionPrompt = 'none';

    // Prevent seeing through the model
    mv.style.backgroundColor = themeSettings.bgColor;

    // Add stabilization for better anchoring
    setTimeout(() => {
      if (mv.activateAR) {
        mv.activateAR();
      }
      setArReady(true);
      setIsLoading(false);
    }, 1000);
  };

  const currentUrl = `${window.location.origin}/ar?src=${encodeURIComponent(glbSrc)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      // Show nice toast instead of alert
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = '✅ AR link copied!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch {
      prompt('Copy this link:', currentUrl);
    }
  };

  const arConfig = useMemo(() => {
    if (isIOS && hasUSDZ) {
      return 'quick-look scene-viewer webxr';
    }
    return 'scene-viewer webxr';
  }, [isIOS, hasUSDZ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="px-4 py-3 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 text-xl">
              <FaCamera />
            </span>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
                Augmented Reality Experience
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
                  {currentTheme.replace(/_/g, ' ')}
                </span>
                {arReady && (
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium flex items-center gap-1">
                    <FaCheck className="text-xs" /> AR Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 font-semibold shadow-sm transition-all duration-200 flex items-center gap-2"
            >
              ← Back to City
            </Link>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isIOS && !hasUSDZ && (
            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <span className="font-semibold">iOS Preview Mode</span>
              </div>
              <p className="text-sm mt-1 text-yellow-700 dark:text-yellow-300">
                Add USDZ files for full AR experience
              </p>
            </div>
          )}

          {isIOS && hasUSDZ && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="font-semibold">iOS AR Ready</span>
              </div>
              <p className="text-sm mt-1 text-green-700 dark:text-green-300">
                Tap "View in AR" for immersive experience
              </p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-8">
          {/* AR Viewer Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
              <model-viewer
                ref={mvRef}
                src={glbSrc}
                ios-src={hasUSDZ ? usdzSrc : undefined}

                // Enhanced AR anchoring
                ar
                ar-modes={arConfig}
                ar-scale="fixed"
                ar-placement={themeSettings.arPlacement}
                stabilization-degree="0.5"

                // Improved interaction
                camera-controls
                touch-action="pan-y"
                reveal="auto"
                loading="eager"
                auto-rotate="false"

                // Visual enhancements
                exposure={themeSettings.exposure}
                environment-image={themeSettings.environmentImage}
                shadow-intensity={themeSettings.arShadow ? 1.0 : 0}
                shadow-softness="0.5"
                tone-mapping="neutral"

                // Camera and view settings - RESTRICTED TO PREVENT LOOKING UNDER
                camera-orbit="0deg 75deg 105%"
                field-of-view="30deg"
                min-camera-orbit="0deg 60deg 100%"
                max-camera-orbit="360deg 90deg 400%"
                min-field-of-view="25deg"
                max-field-of-view="35deg"

                // Disable interaction below the model
                interaction-policy="allow-when-focused"

                style={{
                  width: '100%',
                  height: '75vh',
                  backgroundColor: themeSettings.bgColor,
                }}
                onLoad={handleLoad}
              >
                {/* Enhanced AR Button */}
                <button
                  slot="ar-button"
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3"
                >
                  <span className="text-xl">👆</span>
                  View in AR
                  <span className="text-sm opacity-90">({isIOS ? 'Quick Look' : 'WebXR'})</span>
                </button>

                {/* Theme Badge */}
                <div className="absolute top-6 left-6 bg-black/80 text-white px-4 py-3 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <span className="text-xl text-sky-300">
                    <FaBuilding />
                  </span>
                  <span className="capitalize">{currentTheme.replace(/_/g, ' ')}</span>
                </div>

                {/* Loading Progress */}
                <div slot="progress-bar" className="ar-progress-bar"></div>
              </model-viewer>
            </div>

            {/* Instructions Card - Now properly placed below the AR viewer */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-xl text-sky-300"><FaBullseye /></span>
                How to Use
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-sky-100 dark:bg-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sky-600 dark:text-sky-300 font-bold text-xs mt-0.5 flex-shrink-0">1</span>
                  <p>Tap "View in AR" to launch camera</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-sky-100 dark:bg-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sky-600 dark:text-sky-300 font-bold text-xs mt-0.5 flex-shrink-0">2</span>
                  <p>Point camera at a flat surface</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-sky-100 dark:bg-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sky-600 dark:text-sky-300 font-bold text-xs mt-0.5 flex-shrink-0">3</span>
                  <p>Tap to place the city model</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-sky-100 dark:bg-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sky-600 dark:text-sky-300 font-bold text-xs mt-0.5 flex-shrink-0">4</span>
                  <p>Walk around and explore!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <span className="text-xl text-sky-300"><FaMobileAlt /></span>
                Open on Mobile
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Scan to experience <strong>{currentTheme.replace(/_/g, ' ')}</strong> city in AR.
              </p>

              <div className="flex flex-col items-center space-y-6">
                <QRCode url={currentUrl} size={220} />

                <button
                  onClick={copyLink}
                  className="w-full py-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Copy AR Link
                </button>
              </div>
            </div>

            {/* Tech Info Card */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-xl text-sky-300"><FaInfoCircle /></span>
                Technical Info
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                  <span className="font-medium">{isIOS ? 'iOS' : 'Android/Web'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AR Support:</span>
                  <span className="font-medium">
                    {arStatus === 'supported' ? 'Full WebXR' :
                      isIOS && hasUSDZ ? 'Quick Look' : '3D Preview'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Model Format:</span>
                  <span className="font-medium">{hasUSDZ ? 'GLB + USDZ' : 'GLB'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        model-viewer {
          --progress-bar-color: #3b82f6;
          --progress-bar-height: 3px;
        }
        
        .ar-progress-bar {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          height: 3px;
        }
      `}</style>
    </div>
  );
}