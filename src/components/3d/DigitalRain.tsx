"use client";

import { useMemo, useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Utility to create the matrix character texture
function createMatrixTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();

  context.fillStyle = "black";
  context.fillRect(0, 0, 512, 512);

  context.fillStyle = "white";
  context.font = "bold 32px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Create a grid of characters
  const cols = 16;
  const rows = 16;
  const charWidth = 512 / cols;
  const charHeight = 512 / rows;

  // Katakana + English + Numbers
  const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789:・.=\"*+-<>";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      context.fillText(
        char,
        j * charWidth + charWidth / 2,
        i * charHeight + charHeight / 2
      );
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

const DigitalRainMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#00ff88"), // Bright green
    uColor2: new THREE.Color("#003311"), // Dark green
    uTexture: new THREE.Texture(),
    uClick: new THREE.Vector3(0, 0, -100), // x, y, time
  },
  // Vertex Shader
  `
    attribute float aOffset;
    attribute float aSpeed;
    attribute float aCharIndex;
    
    uniform float uTime;
    
    varying float vOpacity;
    varying float vCharIndex;
    varying vec3 vPos;

    void main() {
      vCharIndex = aCharIndex;
      
      vec3 pos = position;
      // Fall down based on time + speed + offset
      float y = pos.y - mod(uTime * aSpeed * 5.0 + aOffset, 80.0);
      
      // Reset Y if too low (wrap around) 
      // Range is roughly 80 to -80
      if (y < -80.0) y += 160.0;
      
      pos.y = y;
      
      // MAGNIFICATION EFFECT:
      // As particles fall (y goes from 80 down to -80), they get larger.
      // Top (80) -> scale 1.0
      // Bottom (-80) -> scale 4.0
      float dropProgress = (80.0 - y) / 160.0; // 0.0 to 1.0
      float sizeScale = 1.0 + dropProgress * 3.0; 

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Apply scale
      gl_PointSize = (400.0 * sizeScale) / -mvPosition.z; 
      
      gl_Position = projectionMatrix * mvPosition;

      // Fade out at bottom (start fading at -50, fully gone at -75)
      vOpacity = 1.0 - smoothstep(-50.0, -75.0, pos.y);
      vPos = pos;
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uClick; // x, y, time

    varying float vOpacity;
    varying float vCharIndex;
    varying vec3 vPos;

    void main() {
      // Create grid for spritesheet (16x16)
      vec2 uv = gl_PointCoord;
      
      // Map char index to UV offset
      float idx = floor(vCharIndex);
      float row = floor(idx / 16.0);
      float col = mod(idx, 16.0);

      // UV in sprite sheet (1/16 = 0.0625)
      vec2 charUV = (uv + vec2(col, row)) * 0.0625;
      
      vec4 texColor = texture2D(uTexture, charUV);
      if (texColor.r < 0.1) discard; // Alpha test

      // Colors: Gradient based on Y position
      float mixFactor = (vPos.y + 10.0) / 20.0;
      vec3 color = mix(uColor1, uColor2, mixFactor);

      // Ripple Effect
      float dist = distance(vPos.xy, uClick.xy);
      float wave = uTime - uClick.z; // Time since click
      
      if (wave > 0.0 && wave < 2.0) {
          float ring = smoothstep(0.5, 0.0, abs(dist - wave * 10.0)); // Expansion speed
          color += vec3(ring * 1.0); // Bright white ring
      }

      // "Head" glow effect
      float glitch = sin(uTime * 10.0 + vPos.x * 0.5) * 0.5 + 0.5;
      if (glitch > 0.95) color += 0.5;

      gl_FragColor = vec4(color, vOpacity * texColor.r);
    }
  `
);

extend({ DigitalRainMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      digitalRainMaterial: any;
    }
  }
}

export default function DigitalRain({ count = 2000 }) {
  const { clock } = useThree();
  const materialRef = useRef<any>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const clickRef = useRef(new THREE.Vector3(0, 0, -100)); // Init far away/past time
  
  const texture = useMemo(() => createMatrixTexture(), []);

  // Generate particles
  const [positions, offsets, speeds, chars] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    const spd = new Float32Array(count);
    const chr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 30; // X
        pos[i * 3 + 1] = (Math.random() - 0.5) * 80; // Y
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z depth

        off[i] = Math.random() * 20;
        spd[i] = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 0.5);
        chr[i] = Math.floor(Math.random() * 256);
    }
    return [pos, off, spd, chr];
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uTime = state.clock.elapsedTime;
        materialRef.current.uClick = clickRef.current;
    }
  });

  return (
    <>
        <points ref={pointsRef}>
        <bufferGeometry>
            <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
            />
            <bufferAttribute
            attach="attributes-aOffset"
            count={offsets.length}
            array={offsets}
            itemSize={1}
            args={[offsets, 1]}
            />
            <bufferAttribute
            attach="attributes-aSpeed"
            count={speeds.length}
            array={speeds}
            itemSize={1}
            args={[speeds, 1]}
            />
            <bufferAttribute
            attach="attributes-aCharIndex"
            count={chars.length}
            array={chars}
            itemSize={1}
            args={[chars, 1]}
            />
        </bufferGeometry>
        {/* @ts-ignore */}
        <digitalRainMaterial
            ref={materialRef}
            uTexture={texture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
        />
        </points>
        
        {/* Interaction Plane: A hidden plane that captures clicks in 3D space */}
        <mesh 
            position={[0, 0, 0]} 
            onClick={(e) => {
                e.stopPropagation();
                // We use the point of intersection on the plane (Z=0)
                // The rain has Z depth [-5, 5] roughly, so 0 is in the middle.
                // We pass this 3D point to the shader.
                
                // e.point is a Vector3 in world space
                clickRef.current.set(e.point.x, e.point.y, clock.elapsedTime);
                // console.log("Matrix Ripple at:", e.point);
            }}
        >
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    </>
  );
}
