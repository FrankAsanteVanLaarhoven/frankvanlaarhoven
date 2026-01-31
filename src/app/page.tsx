"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.scss";
// Dynamic imports for 3D/Heavy components
const GestureCursor = dynamic(() => import("@/components/ui/GestureCursor"), { ssr: false });
const SceneContainer = dynamic(() => import("@/components/3d/SceneContainer"), {
  ssr: false,
});
const SplineRobotScene = dynamic(() => import("@/components/3d/SplineRobotScene"), {
  ssr: false,
});
const HolographicOS = dynamic(() => import("@/components/ui/HolographicOS"), { 
  ssr: false 
});

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Layer 1: Global 3D Ambience (Digital Rain) */}
      <SceneContainer />
      
      {/* Layer 2: Interactive Robot Avatar (Spline) */}
      <SplineRobotScene />

      {/* Layer 3: Ephemeral UI (Glassmorphism) */}
      <HolographicOS />
      
      {/* Interaction Handlers */}
      <GestureCursor />
      
      {/* Hidden SEO Content (Optional if we go full app, but good to keep basic tags) */}
      <div style={{ display: 'none' }}>
        <h1>Frank van Laarhoven - Cognitive Divide</h1>
        <p>Robotics, AI Assurance, VLA Safety.</p>
        <p>Books: The Cognitive Divide, Navigation Bible.</p>
      </div>
    </main>
  );
}
