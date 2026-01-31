"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { VoiceMode } from "../../hooks/useVoiceCommands";

interface FrankyAvatarProps {
  voiceMode: VoiceMode;
  isSpeaking: boolean;
}

// The Core "Brain" Mesh
function NeuralCore({ voiceMode, isSpeaking }: { voiceMode: VoiceMode; isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Base Colors
  const colors = {
    OFF: "#444444",
    STANDBY: "#00ccff", // Cyan
    ACTIVE: "#00ff9d",  // Green
    SPEAKING: "#ffcc00" // Gold
  };

  const currentColor = isSpeaking 
    ? colors.SPEAKING 
    : (colors[voiceMode] || colors.OFF);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Rotation Logic
    if (voiceMode === "OFF") {
        meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        meshRef.current.rotation.y = time * 0.2;
    } else if (voiceMode === "STANDBY") {
        meshRef.current.rotation.y = time * 0.5;
        meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    } else if (voiceMode === "ACTIVE") {
        // Fast, alert rotation
        meshRef.current.rotation.y = time * 2;
        meshRef.current.rotation.x = Math.sin(time * 2) * 0.2;
    }

    // Scale/Pulse Logic
    let targetScale = 1;
    if (isSpeaking) {
        // Pulse rapidly when speaking
        targetScale = 1.2 + Math.sin(time * 15) * 0.2;
    } else if (voiceMode === "ACTIVE") {
        // Breathing pulse when listening
        targetScale = 1.1 + Math.sin(time * 4) * 0.05;
    }

    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <Sphere args={[1, 64, 64]} ref={meshRef}>
      <MeshDistortMaterial
        color={currentColor}
        envMapIntensity={0.4}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.9} // Holographic metal look
        roughness={0.1}
        distort={isSpeaking ? 0.6 : (voiceMode === 'ACTIVE' ? 0.4 : 0.2)} // More chaos when speaking/active
        speed={isSpeaking ? 5 : 2}
      />
    </Sphere>
  );
}

// Particle Field Aura
function DataAura({ voiceMode }: { voiceMode: VoiceMode }) {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = -state.clock.getElapsedTime() * 0.1;
        }
    });

    if (voiceMode === 'OFF') return null;

    return (
        <group ref={groupRef}>
             {/* Abstract particles */}
             <Stars radius={1.5} depth={0} count={voiceMode === 'ACTIVE' ? 200 : 50} factor={4} saturation={0} fade speed={2} />
        </group>
    );
}

// Main Component
export default function FrankyAvatar({ voiceMode, isSpeaking }: FrankyAvatarProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ccff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <NeuralCore voiceMode={voiceMode} isSpeaking={isSpeaking} />
            <DataAura voiceMode={voiceMode} />
        </Float>
      </Canvas>
    </div>
  );
}
