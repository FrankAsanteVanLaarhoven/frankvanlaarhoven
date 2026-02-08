"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";
// Dynamic imports for 3D/Heavy components
const GestureCursor = dynamic(() => import("@/components/ui/GestureCursor"), { ssr: false });
const SceneContainer = dynamic(() => import("@/components/3d/SceneContainer"), {
  ssr: false,
});
// const SplineRobotScene = dynamic(() => import("@/components/3d/SplineRobotScene"), {
//   ssr: false,
// });
const HolographicOS = dynamic(() => import("@/components/ui/HolographicOS"), { 
  ssr: false 
});

const MetaverseContainer = dynamic(() => import("@/components/metaverse/MetaverseContainer"), {
  ssr: false,
});

export default function Home() {
  const [showMetaverse, setShowMetaverse] = useState(false);

  return (
    <main className={styles.main}>
      {/* Interaction Handlers - Always visible */}
      <GestureCursor />

      {showMetaverse ? (
        <MetaverseContainer onExit={() => setShowMetaverse(false)} />
      ) : (
        <>
          {/* Layer 1: Global 3D Ambience (Digital Rain) */}
          <SceneContainer />
          
          {/* Layer 2: Interactive Robot Avatar (Spline) - Hidden for Matrix Focus */}
          {/* <SplineRobotScene /> */}

          {/* Layer 3: Ephemeral UI (Glassmorphism) */}
          <HolographicOS />
          
          {/* Interaction Handlers */}

          
          {/* Metaverse Launcher Button (Temporary UI) */}
          <button 
            onClick={() => setShowMetaverse(true)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '250px', // Moved left to avoid overlap with FrankyAvatar (150px)
              zIndex: 10001,   // Increased to beat HolographicOS Toolbar (9000) and Cursor (9999)
              padding: '15px 30px',
              background: 'rgba(0, 255, 136, 0.2)',
              border: '1px solid #00ff88',
              color: '#00ff88',
              fontFamily: 'monospace',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              pointerEvents: 'auto' // Explicitly enable pointer events
            }}
          >
            ENTER METAVERSE
          </button>

          {/* Hidden SEO Content */}
          <div style={{ display: 'none' }}>
            <h1>Frank van Laarhoven - Cognitive Divide</h1>
            <p>Robotics, AI Assurance, VLA Safety.</p>
            <p>Books: The Cognitive Divide, Navigation Bible.</p>
          </div>
        </>
      )}
    </main>
  );
}
