// src/pages/ARView.jsx
import { useMemo, useRef, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function QR({ url }) {
  // Only encode once, not double
  const safeUrl = encodeURIComponent(url);
  const src = `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${safeUrl}`;
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
const glbSrc = "/models/Classic_Day_City.glb";
  const mvRef = useRef(null);

  const [isIOS, setIsIOS] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const arModes = useMemo(() => 'webxr scene-viewer', []); // GLB-only → no quick-look

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/i.test(navigator.userAgent));
    const mv = mvRef.current;
    if (!mv) return;
    const onAR = (e) => {
      if (e.detail.status === 'session-started') mv.exposure = 1.0;
      if (e.detail.status === 'not-presenting') mv.exposure = 0.9;
    };
    mv.addEventListener('ar-status', onAR);
    return () => mv.removeEventListener('ar-status', onAR);
  }, []);

  const handleLoad = () => {
    const mv = mvRef.current;
    const model = mv?.model;
    if (!model) return;

    // MATERIAL NORMALIZATION
    try {
      model.materials?.forEach((mat) => {
        const pbr = mat?.pbrMetallicRoughness;
        pbr?.setMetallicFactor?.(0);
        pbr?.setRoughnessFactor?.(0.5);
        if (pbr?.baseColorFactor) {
          const [r, g, b, a = 1] = pbr.baseColorFactor;
          const avg = (r + g + b) / 3;
          if (avg > 0.96) pbr.baseColorFactor = [0.94, 0.94, 0.94, a];
        }
      });
      model.meshes?.forEach((mesh) => {
        if (mesh?.name?.toLowerCase?.().includes('cloud')) {
          mesh.material?.pbrMetallicRoughness?.setRoughnessFactor?.(0.9);
        }
      });
    } catch {}

    // LIGHTING: clamp embedded lights, then apply two-sun look
    const clampScale = 0.35; // 0.30–0.45 to taste
    ['DirectionalLight', 'PointLight', 'SpotLight'].forEach((t) => {
      const nodes = model.getNodesByType?.(t) || [];
      nodes.forEach((l) => {
        const base = typeof l.intensity === 'number' ? l.intensity : 1;
        l.intensity = Math.min(base * clampScale, 2.0);
      });
    });
    const suns = model.getNodesByType?.('DirectionalLight') || [];
    if (suns[0]) {
      suns[0].color = '#FFD4B8'; // warm key
      suns[0].intensity = 1.25;
      suns[0].setTransformation?.({ position: { x: 90, y: 140, z: 70 } });
    }
    if (suns[1]) {
      suns[1].color = '#BFD8FF'; // cool fill
      suns[1].intensity = 0.5;
      suns[1].setTransformation?.({ position: { x: -70, y: 50, z: -40 } });
    }
    if (!suns.length) {
      mv.exposure = 1.0;
      mv.shadowIntensity = 0.4;
    }
  };

const currentUrl = `${window.location.origin}/ar?src=/models/Classic_Day_City.glb`;
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(currentUrl); alert('AR link copied!'); }
    catch { prompt('Copy this AR link:', currentUrl); }
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
            iOS Safari cannot launch AR from GLB. You can still preview the model below. (Add a USDZ later to enable AR on iOS.)
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E171F] shadow">
            <model-viewer
              ref={mvRef}
              onLoad={handleLoad}
              src={glbSrc}

              /* AR + controls (GLB-only) */
              ar
              ar-modes={arModes}        // Android: Scene Viewer; Desktop: WebXR if supported
              ar-scale="fixed"
              camera-controls
              touch-action="pan-y"
              reveal={isMobile ? 'auto' : 'interaction'}

              /* Renderer look to match CityViewer */
              tone-mapping="aces"
              exposure="0.9"
              environment-intensity="0"
              ignore-gltf-lights="false"
              shadow-intensity="0.5"
              shadow-softness="1"

              /* Framing */
              camera-orbit="25deg 55deg 120%"
              field-of-view="45deg"

              style={{ width: '100%', height: '70vh', background: '#f2f5f8' }}
            >
              <button
                slot="ar-button"
                className="mx-4 my-3 px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:bg-sky-700"
              >
                Launch AR
              </button>
            </model-viewer>
          </div>

          <aside className="lg:pt-1">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E171F] shadow p-4">
              <div className="text-sm font-semibold mb-2">Open on your phone</div>
              <p className="text-xs text-gray-600 dark:text-white/70 mb-3">
                Android launches AR via Scene Viewer. iOS shows a 3D preview (GLB-only).
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
