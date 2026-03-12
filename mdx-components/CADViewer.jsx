'use client'

import { Suspense, useRef, useState, useEffect, Component } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ModelErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { error: null }; }
    static getDerivedStateFromError(error) { return { error }; }
    render() {
        if (this.state.error) {
            return (
                <Html center>
                    <div style={{
                        textAlign: "center", fontFamily: "'Courier New', monospace",
                        fontSize: "11px", letterSpacing: "0.08em", maxWidth: 260,
                    }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>⚠</div>
                        <div style={{ color: "#ef4444", marginBottom: 6 }}>FAILED TO LOAD MODEL</div>
                        <div style={{ color: "#475569", wordBreak: "break-all" }}>
                            {this.state.error?.message || "Check that the file exists at the src path and is a valid GLB."}
                        </div>
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}

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
    const ref = useRef();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const setup = () => {
            const fallback = new THREE.MeshStandardMaterial({
                color: 0x888ea8, roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide,
            });
            ref.current.traverse((child) => {
                if (child.isMesh) {
                    if (!child.material) child.material = fallback.clone();
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(m => { m.side = THREE.DoubleSide; m.needsUpdate = true; });
                }
            });

            ref.current.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(ref.current);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / (maxDim || 1);
            ref.current.scale.setScalar(scale);
            ref.current.updateMatrixWorld(true);
            const box2 = new THREE.Box3().setFromObject(ref.current);
            const center2 = new THREE.Vector3();
            box2.getCenter(center2);
            ref.current.position.sub(center2);

            setReady(true);
        };

        const raf = requestAnimationFrame(setup);
        return () => cancelAnimationFrame(raf);
    }, [scene]);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.traverse((child) => {
            if (child.isMesh) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(m => { m.wireframe = wireframe; m.needsUpdate = true; });
            }
        });
    }, [wireframe, ready]);

    return <primitive ref={ref} object={scene} visible={ready} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CADViewer({
    src = "/models/part.glb",
    height = 480,
    background = "#000000",
    autoRotate = false,
    caption,
}) {
    const [rotating, setRotating] = useState(autoRotate);
    const [wireframe, setWireframe] = useState(false);

    const btnStyle = (active) => ({
        padding: "5px 14px",
        border: "1px solid",
        borderColor: active ? "#38bdf8" : "#1e293b",
        background: active ? "rgba(56,189,248,0.1)" : "rgba(15,23,42,0.7)",
        color: active ? "#38bdf8" : "#64748b",
        borderRadius: "4px",
        fontSize: "11px",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.15s ease",
    });

    return (
        <figure style={{
            margin: "2rem 0",
            fontFamily: "'Courier New', monospace",
            border: "2px solid #1e293b",
            borderRadius: "10px",
            overflow: "hidden",
            padding: "20px",
            background: "#000000",
        }}>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginBottom: "8px" }}>
                <button style={btnStyle(rotating)} onClick={() => setRotating(r => !r)}>
                    {rotating ? "⏹ STOP" : "↻ ROTATE"}
                </button>
                <button style={btnStyle(wireframe)} onClick={() => setWireframe(w => !w)}>
                    ⬡ WIRE
                </button>
            </div>

            {/* Canvas */}
            <div style={{ height, borderRadius: "6px", overflow: "hidden" }}>
                <Canvas
                    camera={{ position: [3, 2, 5], fov: 45 }}
                    gl={{ antialias: true, alpha: false }}
                    style={{ background }}
                >
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
                    <directionalLight position={[-4, 2, -4]} intensity={0.4} color="#9bcdff" />
                    <pointLight position={[0, -4, 0]} intensity={0.3} color="#0ea5e9" />
                    <Environment preset="forest" />

                    <ModelErrorBoundary>
                        <Suspense fallback={<LoadingSpinner />}>
                            <WireframeWrapper src={src} wireframe={wireframe} />
                        </Suspense>
                    </ModelErrorBoundary>

                    <OrbitControls
                        autoRotate={rotating}
                        autoRotateSpeed={1.8}
                        enableDamping
                        dampingFactor={0.06}
                        minDistance={1}
                        maxDistance={20}
                    />
                </Canvas>
            </div>

            {/* Caption */}
            {caption && (
                <figcaption style={{
                    marginTop: "8px", fontSize: "14px", color: "#475569", letterSpacing: "0.03em",
                }}>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}