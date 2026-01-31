"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import DigitalRain from "./DigitalRain";
import RosVisualizer from "./RosVisualizer";

export default function Experience() {
  // const cubeRef = useRef<THREE.Mesh>(null); // Removed cube ref

  /* Cube rotation logic removed */

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      
      <DigitalRain count={3000} />
      <RosVisualizer />

      <OrbitControls enableZoom={true} enablePan={false} maxDistance={20} minDistance={2} />
    </>
  );
}
