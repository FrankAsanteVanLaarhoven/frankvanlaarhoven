"use strict";
"use client";

import { Canvas } from "@react-three/fiber";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Suspense } from "react";
import Experience from "./Experience";

export default function SceneContainer() {
  return (
    <>
      <ReactLenis root>
        <div className="canvas-wrapper" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 25], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </div>
      </ReactLenis>
    </>
  );
}
