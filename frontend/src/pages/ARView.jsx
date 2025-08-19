// src/pages/ARView.jsx
import { useMemo, useRef, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

/**
 * Make sure model-viewer is loaded once in index.html:
 * <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
 */

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
  // Accept the model path from ?src=…, fall back to Classic Day
  const glbSrc = decodeURIComponent(params.get('src') || '/models/Classic_Day_City.glb');

  const mvRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // GLB-only AR modes (Scene Viewer + WebXR)
  const arModes = useMemo(() => 'webxr scene-viewer', []);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/i.test(navigator.userAgent));
    const mv = mvRef.current;
    if (!mv) return;

    // Keep exposure stable when AR session starts/ends
    const onAR = (e) => {
      if (e.detail.status === 'session-started') mv.exposure = 1.2;
      if (e.detail.status === 'not-presenting') mv.exposure = 1.2;
    };
    mv.addEventListener('ar-status', onAR);
    return () => mv.removeEventListener('ar-status', onAR);
  }, []);

  const handleLoad = () => {
    const mv = mvRef.current;
    const model = mv?.model;
    if (!model) return;

    // ---- MATERIAL TUNING (matches CityViewer CityModel) ----
    try {
      model.materials?.forEach((mat) => {
        const pbr = mat?.pbrMetallicRoughness;
        // zero metalness + moderate roughness for low-poly look
        pbr?.setMetallicFactor?.(0);
        pbr?.setRoughnessFactor?.(0.5);

        // prevent pure-white blowout (common in stylized assets)
        if (pbr?.baseColorFactor) {
          const [r, g, b, a = 1] = pbr.baseColorFactor;
          const avg = (r + g + b) / 3;
          if (avg > 0.965) pbr.baseColorFactor = [0.94, 0.94, 0.94, a];
        }
      });

      // Soften clouds specifically (like the CityViewer cloud pass)
      model.meshes?.forEach((mesh) => {
        if (mesh?.name?.toLowerCase?.().includes('cloud')) {
          mesh.material?.pbrMetallicRoughness?.setRoughnessFactor?.(0.9);
        }
      });
    } catch {
      // Non-fatal: some platforms lock parts of the scene graph
    }

    // ---- SIMPLIFIED LIGHTING APPROACH ----
    // model-viewer doesn't support custom light creation well, so we'll use a different approach
    
    // 1) Use the GLB lights but modify them heavily
    try {
      const allLights = [];
      ['DirectionalLight', 'PointLight', 'SpotLight'].forEach((t) => {
        const nodes = model.getNodesByType?.(t) || [];
        allLights.push(...nodes);
      });
      
      // Style the first few lights to approximate our setup
      if (allLights[0]) {
        allLights[0].color = '#FFD4B8'; // warm key sun
        allLights[0].intensity = 3.5; // higher intensity
        allLights[0].visible = true;
        allLights[0].castShadow = true;
      }
      if (allLights[1]) {
        allLights[1].color = '#BFD8FF'; // cool fill
        allLights[1].intensity = 1.8; // moderate fill
        allLights[1].visible = true;
        allLights[1].castShadow = false;
      }
      // Disable other lights
      for (let i = 2; i < allLights.length; i++) {
        allLights[i].intensity = 0;
        allLights[i].visible = false;
      }
    } catch (e) {
      console.warn('Light modification failed:', e);
    }

    // ---- AGGRESSIVE RENDERER TUNING ----
    mv.toneMapping = 'aces';
    mv.exposure = 2.0; // Much higher exposure to combat flatness
    mv.shadowIntensity = 0.7; // Stronger shadows for definition
    mv.shadowSoftness = 0.8; // Slightly harder shadows
    
    // Keep environment very low but not zero (for some ambient)
    mv.environmentIntensity = 0.15;
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
          <h1 className="text-xl font-bold">View City in AR</h1>
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/10"
          >
            Back
          </Link>
        </div>

        {isIOS && (
          <div className="mb-3 text-sm px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-900/40">
            iOS Safari can't launch AR from GLB; you'll get a 3D preview here. (Add a USDZ for full iOS AR.)
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          {/* Viewer panel */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E171F] shadow">
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
              /* --- Enhanced Renderer look (more aggressive to combat flatness) --- */
              tone-mapping="aces"
              exposure="2.0"
              environment-intensity="0.15"
              ignore-gltf-lights="false"
              shadow-intensity="0.7"
              shadow-softness="0.8"
              /* Framing - matches CityViewer camera angle better */
              camera-orbit="25deg 55deg 120%"
              field-of-view="45deg"
              /* Background with more contrast */
              style={{ 
                width: '100%', 
                height: '70vh', 
                background: 'linear-gradient(135deg, #fff9e6 0%, #f2f5f8 50%, #e8f4f8 100%)' 
              }}
            >
              <button
                slot="ar-button"
                className="mx-4 my-3 px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:bg-sky-700"
              >
                Launch AR
              </button>
            </model-viewer>
          </div>

          {/* QR / Link panel */}
          <aside className="lg:pt-1">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E171F] shadow p-4">
              <div className="text-sm font-semibold mb-2">Open on your phone</div>
              <p className="text-xs text-gray-600 dark:text-white/70 mb-3">
                Android opens AR in Scene Viewer. iOS shows a 3D preview (GLB-only).
              </p>
              <div className="flex flex-col items-center gap-3">
                <QR url={currentUrl} />
                <button
                  onClick={copyLink}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/10 text-sm"
                >
                  Copy AR Link
                </button>
                <code className="text-[10px] break-all opacity-70">{currentUrl}</code>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}