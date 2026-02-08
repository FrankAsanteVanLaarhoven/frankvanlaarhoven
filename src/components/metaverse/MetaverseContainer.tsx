"use client";

import { XR, createXRStore } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import RoboticLabScene from "./RoboticLabScene";
import { OrbitControls } from "@react-three/drei";

const store = createXRStore();

export default function MetaverseContainer({ onExit }: { onExit: () => void }) {
  const startVR = () => {
    store.enterVR();
  };

  const startAR = () => {
    store.enterAR();
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 100, background: "#000" }}>
      {/* HUD / Overlay for Entering XR */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10002, display: "flex", gap: "10px", pointerEvents: "auto" }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onExit(); }}
          style={{ padding: "10px 20px", background: "rgba(255, 0, 0, 0.5)", color: "white", border: "1px solid red", cursor: "pointer", pointerEvents: "auto" }}
        >
          EXIT METAVERSE
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); startVR(); }}
          style={{ padding: "10px 20px", background: "rgba(0, 255, 0, 0.5)", color: "white", border: "1px solid lime", cursor: "pointer", pointerEvents: "auto" }}
        >
          ENTER VR
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); startAR(); }}
          style={{ padding: "10px 20px", background: "rgba(0, 100, 255, 0.5)", color: "white", border: "1px solid cyan", cursor: "pointer", pointerEvents: "auto" }}
        >
          ENTER AR
        </button>
      </div>

      <Canvas>
        <XR store={store}>
          <Suspense fallback={null}>
            <RoboticLabScene />
          </Suspense>
          <OrbitControls makeDefault />
        </XR>
      </Canvas>
    </div>
  );
}
