// GameBoardViewer.jsx
import React, { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, useProgress, AdaptiveDpr, Preload, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import BoardTileModal from "./BoardTileModal";
import { BOARD_TILES, BOARD_ORDER } from "../../components/game/data/boardTiles";
import { FaDice } from "react-icons/fa";

useGLTF.preload("/game/Monopoly_Game.glb");
useGLTF.preload("/game/Monopoly_Characters.glb");

/* Loader */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="px-4 py-2 rounded-xl bg-white/95 border border-gray-200 text-sm text-gray-700 shadow-lg">
        Loading… {Math.round(progress)}%
      </div>
    </Html>
  );
}

/* Renderer tuning */
function RendererTuning({ exposure = 1.1 }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl, exposure]);
  return null;
}

/* Lights */
function BoardRig() {
  return (
    <>
      <hemisphereLight skyColor={"#fff4e6"} groundColor={"#d9c3a8"} intensity={0.6} />
      <directionalLight
        color={"#FFD4B8"}
        position={[50, 100, 50]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0005}
        shadow-normalBias={0.5}
      />
      <directionalLight color={"#BFD8FF"} position={[-50, 30, -30]} intensity={0.9} />
      <ambientLight intensity={0.15} />
    </>
  );
}

/* Board model that reports flat meshes + bounds for raycasts/path */
function BoardModel({ src, onReady }) {
  const gltf = useGLTF(src);

  useEffect(() => {
    const scene = gltf.scene;
    if (!scene) return;

    // Materials + shadows
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m) return;
          m.metalness = 0;
          m.roughness = 0.5;
          m.envMapIntensity = 0;
        });
      }
    });

    // Center board at origin
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    const surfaceY = box.max.y - center.y + 0.01;

    // Collect mostly-flat meshes (avoid trees/dice/stacks)
    const allMeshes = [];
    scene.traverse((o) => { if (o.isMesh) allMeshes.push(o); });
    const flatMeshes = allMeshes.filter((m) => {
      const b = new THREE.Box3().setFromObject(m);
      const h = b.max.y - b.min.y;
      const name = (m.name || "").toLowerCase();
      const likelyProp = /(tree|dice|coin|stack|bench|note|money)/i.test(name);
      return !likelyProp && h < 0.6;
    });

    onReady?.({
      surfaceY,
      meshes: flatMeshes.length ? flatMeshes : allMeshes,
      bounds: box,
      center,
    });
  }, [gltf, onReady]);

  return (
    <group rotation={[0, 0, 0]} scale={1}>
      <primitive object={gltf.scene} />
    </group>
  );
}

/* Character pawn (recenters XYZ; animation) */
const norm = (s = "") => s.toLowerCase().replace(/[\s_.-]+/g, "").trim();

const CharacterPawn = React.forwardRef(function CharacterPawn(
  { src = "/game/Monopoly_Characters.glb", focus = "Cowboy", play = "Idle", position = [0, 0.02, 0], scale = 0.55, rotationY = 0 },
  ref
) {
  const outer = useRef();
  const inner = useRef();
  const { scene, animations } = useGLTF(src);
  const { actions, clips } = useAnimations(animations, outer);

  const chosen = useMemo(() => {
    const container =
      scene?.children?.length === 1 && scene.children[0]?.children?.length ? scene.children[0] : scene;
    const picks = [];
    container?.children?.forEach((c) => {
      let hasMesh = false;
      c.traverse((n) => { if (n.isMesh) hasMesh = true; });
      if (hasMesh) picks.push(c);
    });
    if (!picks.length) return container;
    const want = norm(focus);
    return picks.find((k) => norm(k.name) === want) || picks.find((k) => norm(k.name).includes(want)) || picks[0];
  }, [scene, focus]);

  useEffect(() => {
    if (!scene || !inner.current) return;
    const container =
      scene?.children?.length === 1 && scene.children[0]?.children?.length ? scene.children[0] : scene;

    container.children.forEach((c) => (c.visible = c === chosen));

    inner.current.clear();
    if (chosen) inner.current.add(chosen);

    // Recenter (X/Z) and rest feet to y=0
    inner.current.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(inner.current);
    const c = box.getCenter(new THREE.Vector3());
    inner.current.position.x += -c.x;
    inner.current.position.z += -c.z;
    inner.current.position.y += -box.min.y;
  }, [scene, chosen]);

  useEffect(() => {
    scene?.traverse?.((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m) return;
          m.metalness = 0;
          m.roughness = 0.5;
          m.envMapIntensity = 0;
        });
      }
    });
  }, [scene]);

  const pickClipName = (want) => {
    if (!clips?.length) return null;
    const w = norm(want);
    return (
      clips.find((c) => norm(c.name) === w)?.name ||
      clips.find((c) => norm(c.name).includes(w))?.name ||
      (w === "walk" && (clips.find((c) => /walk|run/i.test(c.name))?.name)) ||
      (w === "idle" && (clips.find((c) => /idle|stand/i.test(c.name))?.name)) ||
      clips[0].name
    );
  };

  useEffect(() => {
    const name = pickClipName(play);
    if (!name || !actions) return;
    const act = actions[name];
    if (!act) return;
    act.reset().fadeIn(0.2).play();
    return () => {
      const a = actions && actions[name];
      if (a && a.enabled) { try { a.fadeOut(0.2); } catch { } }
    };
  }, [actions, play]);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(outer.current);
    else ref.current = outer.current;
  }, [ref]);

  return (
    <group ref={outer} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <group ref={inner} />
    </group>
  );
});

/* Build a path that fits the real board size (computed after BoardModel loads) */
function makePathFromBounds(bounds, tileCount = BOARD_ORDER.length, margin = 0.12) {
  const w = bounds.max.x - bounds.min.x;
  const d = bounds.max.z - bounds.min.z;
  const halfX = w / 2;
  const halfZ = d / 2;

  // Walk a rectangle just inside the edge artwork
  const rx = halfX * (1 - margin);
  const rz = halfZ * (1 - margin);

  // We’ll do equal segments per side to match tileCount
  const perSide = Math.ceil(tileCount / 4);
  const pts = [];
  const stepX = (2 * rx) / (perSide - 1 || 1);
  const stepZ = (2 * rz) / (perSide - 1 || 1);

  // Bottom (-x->+x), z=+rz
  for (let i = 0; i < perSide; i++) pts.push(new THREE.Vector3(-rx + i * stepX, 0, rz));
  // Right ( +z->-z), x=+rx
  for (let i = 1; i < perSide; i++) pts.push(new THREE.Vector3(rx, 0, rz - i * stepZ));
  // Top ( +x->-x ), z=-rz
  for (let i = 1; i < perSide; i++) pts.push(new THREE.Vector3(rx - i * stepX, 0, -rz));
  // Left ( -z->+z ), x=-rx
  for (let i = 1; i < perSide - 1; i++) pts.push(new THREE.Vector3(-rx, 0, -rz + i * stepZ));

  return pts.slice(0, tileCount);
}

/* Glue Y to board via raycast; arrival checked in XZ-plane */
function MovementController({ pieceRef, path, targetIndex, onArrive, onMoveState, speed = 7, groundYAt, offset = [0, 0] }) {
  const lastIdx = useRef(-1); // Start with -1 to ensure first movement triggers
  const currentPosition = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const mesh = pieceRef?.current;
    const dest = path[targetIndex];
    if (!mesh || !dest) return;

    // Initialize current position if this is the first frame
    if (lastIdx.current === -1) {
      currentPosition.current.copy(mesh.position);
      lastIdx.current = targetIndex;
    }

    // If target index changed, we need to start moving
    if (lastIdx.current !== targetIndex) {
      lastIdx.current = targetIndex;
      onMoveState?.(true);
    }

    // apply small offset so multiple pawns don't overlap
    const ox = Array.isArray(offset) ? (offset[0] || 0) : 0;
    const oz = Array.isArray(offset) ? (offset[1] || 0) : 0;

    const cx = currentPosition.current.x;
    const cz = currentPosition.current.z;
    const tx = dest.x + ox;
    const tz = dest.z + oz;
    const dx = tx - cx;
    const dz = tz - cz;
    const planarDist = Math.hypot(dx, dz);

    if (planarDist <= 0.02) {
      // Arrived at destination
      const y = groundYAt ? groundYAt(tx, tz) : mesh.position.y;
      mesh.position.set(tx, y, tz);
      currentPosition.current.set(tx, y, tz);
      onMoveState?.(false);
      onArrive?.(targetIndex);
      return;
    }

    // Move towards destination
    const step = Math.min(planarDist, speed * delta);
    const nx = cx + (dx / planarDist) * step;
    const nz = cz + (dz / planarDist) * step;
    const ny = groundYAt ? groundYAt(nx, nz) : mesh.position.y;

    mesh.position.set(nx, ny, nz);
    currentPosition.current.set(nx, ny, nz);
    mesh.rotation.y = Math.atan2(dx, dz);
  });

  return null;
}

/* Orbit limits */
function LimitedOrbit() {
  return (
    <OrbitControls
      enableDamping
      enablePan
      panSpeed={0.5}
      target={[0, 0, 0]}
      minDistance={10}
      maxDistance={30}
      minPolarAngle={0.8}
      maxPolarAngle={1.4}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  );
}

/* Main viewer */
export default function GameBoardViewer({
  glbPath = "/game/Monopoly_Game.glb",
  charactersGlb = "/game/Monopoly_Characters.glb",
  selectedCharacter = "Cowboy",
  camera = { position: [0, 26, 42], fov: 38 },
  exposure = 1.1,
  pawns = [] // [{ key:'p1', character:'Cowboy', index: 0 }, ...]
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [boardSurfaceY, setBoardSurfaceY] = useState(0.0);
  const [path, setPath] = useState([]);
  const boardMeshesRef = useRef([]);

  // legacy single-pawn state (fallback only)
  const [tileIndex, setTileIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const pieceRef = useRef();

  // NEW: one ref per pawn so each can animate independently
  const pawnRefs = useRef({});
  const getPawnRef = (k) => {
    if (!pawnRefs.current[k]) pawnRefs.current[k] = React.createRef();
    return pawnRefs.current[k];
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTile, setActiveTile] = useState(null);

  const [diceResult, setDiceResult] = useState(null);
  const [showDiceResult, setShowDiceResult] = useState(false);
  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const handleRoll = () => {
    const result = rollDice();
    setDiceResult(result);
    setShowDiceResult(true);
    const dest = (tileIndex + result) % BOARD_ORDER.length;
    setIsMoving(true);
    setTileIndex(dest);
    setTimeout(() => setShowDiceResult(false), 3000);
  };

  const handleArrive = (idx) => {
    const tileId = BOARD_ORDER[idx];
    setActiveTile(BOARD_TILES[tileId]);
    setModalOpen(true);
  };

  /* Grounding helpers */
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const down = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const groundYAt = useCallback(
    (x, z) => {
      const meshes = boardMeshesRef.current || [];
      if (!meshes.length) return boardSurfaceY;
      raycaster.set(new THREE.Vector3(x, boardSurfaceY + 10, z), down);
      const hits = raycaster.intersectObjects(meshes, true);
      return hits.length ? hits[0].point.y + 0.01 : boardSurfaceY;
    },
    [boardSurfaceY, raycaster, down]
  );

  /* Build path after board loads; place pawn on first point */
  const handleBoardReady = useCallback(({ surfaceY, meshes, bounds }) => {
    setBoardSurfaceY(surfaceY);
    boardMeshesRef.current = meshes;

    const p = makePathFromBounds(bounds, BOARD_ORDER.length, 0.12);
    setPath(p);

    // place legacy pawn right away (fallback)
    if (pieceRef.current && p[0]) {
      const y = groundYAt(p[0].x, p[0].z);
      pieceRef.current.position.set(p[0].x, y, p[0].z);
    }
  }, [groundYAt]);

  // If path changes (first load), ensure legacy pawn is set (fallback)
  useEffect(() => {
    if (pieceRef.current && path[0]) {
      const y = groundYAt(path[0].x, path[0].z);
      pieceRef.current.position.set(path[0].x, y, path[0].z);
    }
  }, [path, groundYAt]);

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-inner">
      <Canvas
        dpr={[0.8, 1.2]}
        gl={{ powerPreference: "high-performance", antialias: true }}
        shadows
        camera={camera}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = exposure;
          if (gl.outputColorSpace !== undefined) gl.outputColorSpace = THREE.SRGBColorSpace;
          setIsLoaded(true);
        }}
      >
        <color attach="background" args={["#f2f5f8"]} />
        <RendererTuning exposure={exposure} />
        <BoardRig />

        <Suspense fallback={<Loader />}>
          <BoardModel src={glbPath} onReady={handleBoardReady} />

          {/* === PAWNS === */}
          {pawns && pawns.length > 0 ? (
            <>
              {pawns.map((p, i) => {
                const idx = Math.max(0, Math.min(p.index ?? 0, path.length - 1));
                const spot = path[idx] || path[0];
                if (!spot) return null;

                // tiny radial spread so they don't overlap on the same tile
                const radius = 0.35;
                const angle = (i / Math.max(1, pawns.length)) * Math.PI * 2;
                const ox = Math.cos(angle) * radius;
                const oz = Math.sin(angle) * radius;

                // Start all pawns at the beginning position (index 0)
                const startSpot = path[0] || { x: 0, z: 0 };
                const y = groundYAt(startSpot.x, startSpot.z);

                const ref = getPawnRef(p.key || `pawn_${i}`);

                return (
                  <React.Fragment key={p.key || i}>
                    <CharacterPawn
                      ref={ref}
                      src={charactersGlb}
                      focus={p.character || selectedCharacter}
                      play={"Idle"}
                      // Start all pawns at position 0 initially
                      position={[startSpot.x, y, startSpot.z]}
                      scale={0.55}
                    />
                    {path.length > 0 && (
                      <MovementController
                        pieceRef={ref}
                        path={path}
                        targetIndex={idx} // This will now trigger movement from 0 to target
                        groundYAt={groundYAt}
                        offset={[ox, oz]}
                        // Add these callbacks to handle animation state
                        onMoveState={(moving) => {
                          // You might want to track movement state per pawn
                          console.log(`Pawn ${p.key} is ${moving ? 'moving' : 'idle'}`);
                        }}
                        onArrive={(arrivedIndex) => {
                          console.log(`Pawn ${p.key} arrived at tile ${arrivedIndex}`);
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            // Fallback: original single pawn mode
            <>
              <CharacterPawn
                ref={pieceRef}
                src={charactersGlb}
                focus={selectedCharacter}
                play={isMoving ? "Walk" : "Idle"}
                position={path[0]?.toArray() ?? [0, boardSurfaceY, 0]}
                scale={0.55}
              />
              {path.length > 0 && (
                <MovementController
                  pieceRef={pieceRef}
                  path={path}
                  targetIndex={tileIndex}
                  onArrive={handleArrive}
                  onMoveState={setIsMoving}
                  groundYAt={groundYAt}
                />
              )}
            </>
          )}

          <Preload all />
        </Suspense>

        <AdaptiveDpr pixelated />
        <LimitedOrbit />
      </Canvas>

      {/* hint */}
      {isLoaded && (
        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 text-xs text-gray-600 shadow">
          Drag to rotate • Scroll to zoom
        </div>
      )}

      {/* Local HUD (kept for standalone viewer) */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          onClick={handleRoll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-600 transition-colors"
          title="Roll Dice"
        >
          <FaDice className="text-lg" />
          Roll Dice
        </button>

        <div className="px-3 py-2 rounded-xl bg-white/90 border shadow text-sm">
          Tile: <span className="font-semibold">{BOARD_TILES[BOARD_ORDER[tileIndex]]?.label}</span>
        </div>

        {showDiceResult && (
          <div className="px-4 py-2 rounded-xl bg-lime-500 text-white font-bold text-lg shadow-lg animate-pulse">
            {diceResult}
          </div>
        )}
      </div>

      {/* Tooltip Modal */}
      <BoardTileModal
        open={modalOpen}
        data={activeTile}
        onClose={() => setModalOpen(false)}
        onAction={() => setModalOpen(false)}
      />
    </div>
  );
}