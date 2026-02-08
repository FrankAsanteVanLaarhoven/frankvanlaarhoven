import React, { useRef, useEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { gsap } from 'gsap';

interface EphemeralWidgetProps {
    assetUrl: string;
    position: [number, number, number];
    scale: number;
    rotationY: number;
    delay: number;
}

export const EphemeralWidget: React.FC<EphemeralWidgetProps> = ({ assetUrl, position, scale, rotationY, delay }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate random values once per mount to keep render pure
    const randomId = useMemo(() => Math.floor(Math.random() * 9999).toString().padStart(4, '0'), []);
    const randomLat = useMemo(() => Math.floor(Math.random() * 50), []);
    const randomFloatDuration = useMemo(() => 3 + Math.random(), []);

    // Initial Materialization Effect
    useEffect(() => {
        if (!containerRef.current) return;

        // Start State: Invisible, blurred, scaled down
        gsap.set(containerRef.current, { 
            opacity: 0, 
            scale: 0.5, 
            filter: 'blur(20px)',
            y: 50 
        });

        // Entrance Animation
        gsap.to(containerRef.current, {
            duration: 1.2,
            delay: delay,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            ease: "elastic.out(1, 0.75)"
        });

        // Continuous Float Animation
        gsap.to(containerRef.current, {
            y: "-=15", // Float up 15px
            duration: randomFloatDuration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: delay + 1.2 // Start after entrance
        });

    }, [delay, randomFloatDuration]);

    return (
        <Html 
            position={position} 
            transform 
            occlude 
            rotation={[0, rotationY, 0]} 
            style={{ 
                transform: `scale(${scale})`,
                pointerEvents: 'none' // Container ignores, children allow
            }}
        >
            <div 
                ref={containerRef}
                className="ephemeral-widget-glass"
                style={{
                    width: '320px',
                    // SOTA Glassmorphism
                    background: 'rgba(10, 25, 40, 0.65)', // Darker tint for contrast
                    backdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 0 40px rgba(0, 255, 157, 0.1), inset 0 0 20px rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'grab',
                    pointerEvents: 'auto',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { scale: 1.05, border: '1px solid #00ff9d', duration: 0.3 });
                }}
                onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { scale: 1, border: '1px solid rgba(255, 255, 255, 0.15)', duration: 0.3 });
                }}
                role="button"
                tabIndex={0}
            >
                {/* Header / Decor */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    alignItems: 'center'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff9d', boxShadow: '0 0 8px #00ff9d' }} />
                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(0,255,157,0.5), transparent)', margin: '0 10px' }} />
                    <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#00ff9d', letterSpacing: '1px' }}>VLA.NODE</div>
                </div>
                
                {/* Asset Image (Using img for simplicity in 3D HTML context) */}
                <div style={{ overflow: 'hidden', borderRadius: '12px', width: '100%', marginBottom: '12px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={assetUrl} 
                        alt={`Widget Content ${randomId}`} 
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            objectFit: 'cover'
                        }}
                    />
                </div>
                
                {/* Tech Footer */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.4)'
                }}>
                     <span>ID: {randomId}</span>
                     <span>LAT: {randomLat}ms</span>
                </div>
            </div>
        </Html>
    );
};
