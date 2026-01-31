"use client";

import Spline from '@splinetool/react-spline';
import { useState } from 'react';
import styles from './SplineRobotScene.module.scss';

export default function SplineRobotScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.sceneWrapper}>
      {!loaded && <div className={styles.loader}>Initializing Neural Link...</div>}
      
      {/* 
        Using original valid URL. 
        Added HUD overlay to simulate Robot Point-of-View even if model is subtle.
      */}
      <Spline 
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        onLoad={() => setLoaded(true)}
        className={styles.splineCanvas}
      />
      
      {/* Neural Interface Overlay (HUD) */}
      <div className={styles.hudOverlay}>
         <div className={styles.reticleCenter}></div>
         <div className={styles.scanLine}></div>
         <div className={styles.sysText}>NEURAL_LINK: ACTIVE</div>
      </div>
    </div>
  );
}
