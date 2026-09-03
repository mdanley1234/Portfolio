'use client'

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// three + drei are ~600 kB. They load only once the viewer scrolls into range,
// so a project page that happens to contain one still starts fast.
const CADScene = dynamic(() => import("./CADScene"), { ssr: false });

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
    const [armed, setArmed] = useState(false);
    const frame = useRef(null);

    useEffect(() => {
        const el = frame.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setArmed(true);
                io.disconnect();
            }
        }, { rootMargin: "400px" });
        io.observe(el);
        return () => io.disconnect();
    }, []);

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
        <figure ref={frame} style={{
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
            <div style={{ height, borderRadius: "6px", overflow: "hidden", background }}>
                {armed ? (
                    <CADScene
                        src={src}
                        rotating={rotating}
                        wireframe={wireframe}
                        background={background}
                    />
                ) : (
                    <div style={{
                        height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#475569", fontSize: "13px", letterSpacing: "0.05em",
                    }}>
                        PREPARING VIEWER
                    </div>
                )}
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
