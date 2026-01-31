"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";

export default function RosVisualizer() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Simulated Lidar Data (Revolving points)
  const particleCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 5 + Math.random() * 10; // Radius 5-15 units
        const y = (Math.random() - 0.5) * 2;
        pos[i * 3] = r * Math.cos(theta);
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    // Rotate lidar scan
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.5; // Slow spin
    }
    // Slowly rotate entire diag group
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Simulated Lidar Scan points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#00ff88"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Floating Diagnostics Text */}
      <group position={[4, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
         <Html
            transform
            distanceFactor={10}
            occlude
            onOcclude={() => null} // Optional: hide when behind objects
            style={{
                fontFamily: 'monospace',
                color: '#00ff88',
                fontSize: '10px',
                background: 'rgba(0,0,0,0.6)',
                padding: '4px',
                border: '1px solid #00ff88',
                userSelect: 'none',
                pointerEvents: 'none',
            }}
         >
            <div>
                <div>TOPIC: /scan</div>
                <div>FREQ: 20Hz</div>
                <div>PTS: {particleCount}</div>
            </div>
         </Html>
      </group>

      <group position={[-3, 0.5, 2]} rotation={[0, Math.PI / 2, 0]}>
         <Html
            transform
            distanceFactor={8}
            style={{
                fontFamily: 'monospace',
                color: '#00ffff',
                fontSize: '10px',
                background: 'rgba(0,0,0,0.8)',
                padding: '5px',
                border: '1px dashed #00ffff',
                userSelect: 'none',
                 pointerEvents: 'none',
            }}
         >
             <div>
                <div>STATUS: OK</div>
                <div>NODE: /vla_nav</div>
             </div>
         </Html>
      </group>

    </group>
  );
}
