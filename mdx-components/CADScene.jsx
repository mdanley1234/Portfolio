'use client'

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, invalidate } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function LoadingSpinner() {
    return (
        <Html center>
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                color: "#94a3b8", fontFamily: "'Courier New', monospace", fontSize: "13px", letterSpacing: "0.05em",
            }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" stroke="#334155" strokeWidth="2" />
                    <path d="M16 3 A13 13 0 0 1 29 16" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.9s" repeatCount="indefinite" />
                    </path>
                </svg>
                LOADING MODEL
            </div>
        </Html>
    );
}

// ─── Model ────────────────────────────────────────────────────────────────────
function WireframeWrapper({ src, wireframe }) {
    const { scene } = useGLTF(src);

    // Normalise scale and recentre before the first draw. Resetting the
    // transform first keeps this idempotent — React may run it twice in dev,
    // and useGLTF hands back a shared, cached scene.
    const model = useMemo(() => {
        scene.traverse((child) => {
            if (!child.isMesh) return;
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(m => { if (m) { m.side = THREE.DoubleSide; m.needsUpdate = true; } });
        });

        scene.position.set(0, 0, 0);
        scene.scale.setScalar(1);
        scene.updateMatrixWorld(true);

        const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
        scene.scale.setScalar(3 / (Math.max(size.x, size.y, size.z) || 1));
        scene.updateMatrixWorld(true);
        scene.position.sub(new THREE.Box3().setFromObject(scene).getCenter(new THREE.Vector3()));

        return scene;
    }, [scene]);

    useEffect(() => {
        model.traverse((child) => {
            if (!child.isMesh) return;
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(m => { if (m) { m.wireframe = wireframe; m.needsUpdate = true; } });
        });
        invalidate();
    }, [model, wireframe]);

    return <primitive object={model} />;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
export default function CADScene({ src, rotating, wireframe, background }) {
    return (
        <Canvas
            // An idle scene stops rendering; OrbitControls re-arms the loop.
            frameloop={rotating ? "always" : "demand"}
            dpr={[1, 1.5]}
            camera={{ position: [3, 2, 5], fov: 45 }}
            gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
        >
            <color attach="background" args={[background]} />

            {/* A local rig instead of <Environment preset>, which fetches a
                multi-megabyte HDR from a third-party CDN on every view. */}
            <hemisphereLight args={["#cfe0ff", "#0b1020", 0.55]} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 8, 5]} intensity={1.4} />
            <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#9bcdff" />
            <pointLight position={[0, -4, 0]} intensity={0.35} color="#0ea5e9" />

            <Suspense fallback={<LoadingSpinner />}>
                <WireframeWrapper src={src} wireframe={wireframe} />
            </Suspense>

            <OrbitControls
                makeDefault
                autoRotate={rotating}
                autoRotateSpeed={1.8}
                enableDamping
                dampingFactor={0.06}
                minDistance={1}
                maxDistance={20}
            />
        </Canvas>
    );
}
