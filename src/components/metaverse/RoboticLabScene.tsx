"use client";

import { Environment, Grid, Html, Image, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import EphemeralInterface from "./EphemeralInterface";
import { ASSET_BUNDLES } from "../../config/assets";

export default function RoboticLabScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [iotActive, setIotActive] = useState(false);

  // Rotate the entire lab slowly for a "floating" feel in non-VR
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Sci-Fi Environment */}
      <Environment preset="city" background={true} blur={0.8} />

      <group ref={groupRef}>
        {/* Floor Grid */}
        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          sectionColor="#00ff88" 
          cellColor="#003311" 
          position={[0, -2, 0]} 
        />

        {/* --- CENTRAL HUB --- */}
        
        {/* Center Main Screen */}
        <Image 
          url={ASSET_BUNDLES.scenery[0]} 
          position={[0, 2, -5]} 
          scale={[8, 4.5, 1] as any}
          transparent
          opacity={0.9}
        />
        <Text position={[0, -0.5, -5]} fontSize={0.5} color="#00ff88">
          ROBOTIC COMMAND CENTER
        </Text>

        {/* --- COLLABORATION / WEBINAR ZONE (Left) --- */}
        <group position={[-8, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
            <Text position={[0, 4, 0]} fontSize={0.3} color="#00ffff">
              COLLABORATION ZONE
            </Text>
            {/* Webinar Screen Placeholder */}
            <Image 
              url={ASSET_BUNDLES.scenery[1]} 
              position={[0, 2, 0]} 
              scale={[6, 3.5, 1] as any}
              transparent
            />
            {/* "Floating" Seats */}
            <mesh position={[-1, 0, 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
              <meshStandardMaterial color="#00ffff" wireframe />
            </mesh>
            <mesh position={[1, 0, 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
              <meshStandardMaterial color="#00ffff" wireframe />
            </mesh>
        </group>

        {/* --- IOT / EDGE DEVICE LAB (Right) --- */}
        <group position={[8, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
            <Text position={[0, 4, 0]} fontSize={0.3} color="#ff00ff">
              IoT EDGE LAB
            </Text>
            <Image 
              url={ASSET_BUNDLES.scenery[2]} 
              position={[0, 2, 0]} 
              scale={[6, 3.5, 1] as any}
              transparent
            />
            
            {/* Interactive HTML Panel for "Real World" Edge Control */}
            <Html transform position={[0, 1.5, 1]} scale={0.5}>
              <div style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '10px', border: '1px solid #ff00ff', color: 'white', width: '300px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#ff00ff' }}>Edge Device: NV-Jetson-01</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Status:</span>
                  <span style={{ color: '#00ff00' }}>ONLINE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Latency:</span>
                  <span>12ms</span>
                </div>
                <button 
                  onClick={() => setIotActive(!iotActive)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    background: iotActive ? '#ff00ff' : '#333', 
                    border: 'none', 
                    color: 'white', 
                    cursor: 'pointer' 
                  }}
                >
                  {iotActive ? 'STOP STREAM' : 'START STREAM'}
                </button>
              </div>
            </Html>
        </group>

        {/* Back Panel (360 feel) */}
        <Image 
          url={ASSET_BUNDLES.scenery[3]} 
          position={[0, 2, 5]} 
          rotation={[0, Math.PI, 0]} 
          scale={[8, 4.5, 1] as any}
          transparent
        />

        {/* --- EPHEMERAL MENTAT UI LAYER --- */}
        <EphemeralInterface />

      </group>
    </>
  );
}
