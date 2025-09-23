// src/pages/ARView.jsx
import { useMemo, useRef, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

/**
 * Make sure model-viewer is loaded once in index.html:
 * <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
 */

// Theme detection from GLB path
const detectThemeFromPath = (glbPath) => {
  const path = glbPath.toLowerCase();
  if (path.includes('classic_day')) return 'classic_day';
  if (path.includes('foggy_morning')) return 'foggy_morning';
  if (path.includes('golden_hour')) return 'golden_hour';
  if (path.includes('neon_night')) return 'neon_night';
  if (path.includes('rainy_evening')) return 'rainy_evening';
  if (path.includes('sunset_pink')) return 'sunset_pink';
  return 'classic_day'; // default
};

// Theme-specific settings that match CityViewer
const THEME_SETTINGS = {
  classic_day: {
    exposure: 1.1,
    bgGradient: 'linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 50%, #d9e8ff 100%)',
    environmentIntensity: 0.3,
    shadowIntensity: 0.7,
  },
  foggy_morning: {
    exposure: 0.85,
    bgGradient: 'linear-gradient(135deg, #d0d8e0 0%, #c8d0d8 50%, #b8c5d5 100%)',
    environmentIntensity: 0.5,
    shadowIntensity: 0.4,
  },
  golden_hour: {
    exposure: 1.2,
    bgGradient: 'linear-gradient(135deg, #ffebd6 0%, #ffdfc2 50%, #ffd6b3 100%)',
    environmentIntensity: 0.4,
    shadowIntensity: 0.6,
  },
  neon_night: {
    exposure: 0.6,
    bgGradient: 'linear-gradient(135deg, #050520 0%, #0a0a2a 50%, #151540 100%)',
    environmentIntensity: 0.1,
    shadowIntensity: 0.8,
  },
  rainy_evening: {
    exposure: 0.75,
    bgGradient: 'linear-gradient(135deg, #a8b0b8 0%, #8a98a8 50%, #6a7888 100%)',
    environmentIntensity: 0.3,
    shadowIntensity: 0.5,
  },
  sunset_pink: {
    exposure: 1.15,
    bgGradient: 'linear-gradient(135deg, #ffe6f0 0%, #ffd6e0 50%, #ffc2d6 100%)',
    environmentIntensity: 0.35,
    shadowIntensity: 0.6,
  },
};

function QR({ url }) {
  const safe = encodeURIComponent(url);
  const src = `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${safe}`;
  return (
    <img
      src={src}
      alt="Open on phone"
      className="rounded-lg border border-black/10 dark:border-white/10 bg-white"
      width={220}
      height={220}
    />
  );
}

export default function ARView() {
  const [params] = useSearchParams();
  const glbSrc = decodeURIComponent(params.get('src') || '/models/Classic_Day_City.glb');
  
  // Detect theme from GLB path
  const currentTheme = detectThemeFromPath(glbSrc);
  const themeSettings = THEME_SETTINGS[currentTheme];

  const mvRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // GLB-only AR modes (Scene Viewer + WebXR)
  const arModes = useMemo(() => 'webxr scene-viewer', []);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/i.test(navigator.userAgent));
  }, []);

  const handleLoad = () => {
    const mv = mvRef.current;
    const model = mv?.model;
    if (!model) return;

    // Apply theme-specific settings
    mv.exposure = themeSettings.exposure;
    mv.environmentIntensity = themeSettings.environmentIntensity;
    mv.shadowIntensity = themeSettings.shadowIntensity;

    // ---- MATERIAL TUNING (theme-aware) ----
    try {
      model.materials?.forEach((mat) => {
        const pbr = mat?.pbrMetallicRoughness;
        if (!pbr) return;

        // Base material properties
        pbr.setMetallicFactor?.(0);
        pbr.setRoughnessFactor?.(0.5);

        // Theme-specific material adjustments
        if (currentTheme === 'neon_night') {
          // Boost emission for neon theme
          if (mat.emissiveFactor) {
            const [r, g, b] = mat.emissiveFactor;
            const intensity = Math.sqrt(r * r + g * g + b * b);
            if (intensity > 0.1) {
              // Boost existing emissions
              mat.setEmissiveFactor?.([r * 1.5, g * 1.5, b * 1.5]);
            }
          }
        }

        // Prevent over-bright surfaces
        if (pbr.baseColorFactor) {
          const [r, g, b, a = 1] = pbr.baseColorFactor;
          const avg = (r + g + b) / 3;
          if (avg > 0.95) {
            pbr.baseColorFactor = [0.92, 0.92, 0.92, a];
          }
        }
      });

      // Cloud-specific adjustments
      model.meshes?.forEach((mesh) => {
        if (mesh?.name?.toLowerCase?.().includes('cloud')) {
          mesh.material?.pbrMetallicRoughness?.setRoughnessFactor?.(0.9);
        }
      });
    } catch (error) {
      console.warn('Material tuning failed:', error);
    }

    // ---- LIGHTING SETUP ----
    try {
      const allLights = [];
      ['DirectionalLight', 'PointLight', 'SpotLight'].forEach((t) => {
        const nodes = model.getNodesByType?.(t) || [];
        allLights.push(...nodes);
      });

      // Theme-specific lighting
      if (currentTheme === 'classic_day' && allLights[0]) {
        allLights[0].color = '#FFD4B8';
        allLights[0].intensity = 3.5;
        allLights[0].visible = true;
      } else if (currentTheme === 'neon_night' && allLights[0]) {
        allLights[0].color = '#4a7bff';
        allLights[0].intensity = 1.5;
        allLights[0].visible = true;
      } else if (currentTheme === 'golden_hour' && allLights[0]) {
        allLights[0].color = '#ff9a57';
        allLights[0].intensity = 3.0;
        allLights[0].visible = true;
      }

      // Disable extra lights
      for (let i = 1; i < allLights.length; i++) {
        allLights[i].intensity = 0;
        allLights[i].visible = false;
      }
    } catch (error) {
      console.warn('Light modification failed:', error);
    }

    // Final renderer settings
    mv.toneMapping = 'aces';
    mv.shadowSoftness = 0.7;
  };

  const currentUrl = `${window.location.origin}/ar?src=${encodeURIComponent(glbSrc)}`;
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('AR link copied!');
    } catch {
      prompt('Copy this AR link:', currentUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f5f8] dark:bg-[#0E171F] text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold">View City in AR</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Theme: <span className="font-medium capitalize">{currentTheme.replace('_', ' ')}</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/10"
          >
            Back to City
          </Link>
        </div>

        {isIOS && (
          <div className="mb-3 text-sm px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-900/40">
            iOS Safari can't launch AR from GLB; you'll get a 3D preview here. (Add a USDZ for full iOS AR.)
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          {/* Viewer panel */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E171F] shadow overflow-hidden">
            <model-viewer
              key={glbSrc}
              ref={mvRef}
              onLoad={handleLoad}
              src={glbSrc}
              /* AR + controls */
              ar
              ar-modes={arModes}
              ar-scale="fixed"
              camera-controls
              touch-action="pan-y"
              /* Avoid blank desktop preview */
              reveal="auto"
              loading="eager"
              interaction-prompt={isMobile ? 'auto' : 'none'}
              /* Theme-specific settings */
              tone-mapping="aces"
              exposure={themeSettings.exposure.toString()}
              environment-intensity={themeSettings.environmentIntensity.toString()}
              shadow-intensity={themeSettings.shadowIntensity.toString()}
              shadow-softness="0.7"
              ignore-gltf-lights="false"
              /* Camera framing */
              camera-orbit="25deg 55deg 120%"
              field-of-view="45deg"
              /* Theme-specific background */
              style={{ 
                width: '100%', 
                height: '70vh', 
                background: themeSettings.bgGradient
              }}
            >
              <button
                slot="ar-button"
                className="mx-4 my-3 px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:bg-sky-700 font-medium"
              >
                🕶️ Launch AR
              </button>
              
              {/* Theme indicator badge */}
              <div 
                slot="hotspot-theme" 
                className="theme-badge"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {currentTheme.replace('_', ' ').toUpperCase()}
              </div>
            </model-viewer>
          </div>

          {/* QR / Link panel */}
          <aside className="lg:pt-1">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E171F] shadow p-4">
              <div className="text-sm font-semibold mb-2">Open on your phone</div>
              <p className="text-xs text-gray-600 dark:text-white/70 mb-3">
                Scan QR code or copy link to view <strong>{currentTheme.replace('_', ' ')}</strong> theme in AR.
              </p>
              <div className="flex flex-col items-center gap-3">
                <QR url={currentUrl} />
                <button
                  onClick={copyLink}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/10 text-sm"
                >
                  Copy AR Link
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Theme: <span className="font-medium">{currentTheme.replace('_', ' ')}</span>
                </div>
                <code className="text-[10px] break-all opacity-70 max-w-full overflow-hidden text-ellipsis">
                  {currentUrl}
                </code>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}