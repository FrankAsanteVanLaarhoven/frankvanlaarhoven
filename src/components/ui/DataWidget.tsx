import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { gsap } from 'gsap';

interface DataWidgetProps {
    id: string;
    content?: string;
    position: [number, number, number];
    scale: number;
    rotationY: number;
    delay: number;
}

export const DataWidget: React.FC<DataWidgetProps> = ({ id, content = "NO DATA", position, scale, rotationY, delay }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayedText, setDisplayedText] = useState("");

    // Initial Materialization Effect
    useEffect(() => {
        if (!containerRef.current) return;

        // Start State
        gsap.set(containerRef.current, { 
            opacity: 0, 
            scale: 0.5, 
            filter: 'blur(20px)',
            y: 50 
        });

        // Entrance
        gsap.to(containerRef.current, {
            duration: 1.0,
            delay: delay,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            ease: "power2.out"
        });

        // Float
        gsap.to(containerRef.current, {
            y: "-=10",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: delay + 1.0
        });

    }, [delay]);

    // Typing Effect
    useEffect(() => {
        let i = 0;
        const speed = 30; // ms
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayedText(content.substring(0, i + 1));
                i++;
                if (i > content.length) clearInterval(interval);
            }, speed);
            return () => clearInterval(interval);
        }, (delay * 1000) + 500); // Start after entrance

        return () => clearTimeout(timeout);
    }, [content, delay]);

    return (
        <Html 
            position={position} 
            transform 
            occlude 
            rotation={[0, rotationY, 0]} 
            style={{ 
                transform: `scale(${scale})`,
                pointerEvents: 'none'
            }}
        >
            <div 
                ref={containerRef}
                style={{
                    width: '280px',
                    background: 'rgba(0, 20, 40, 0.8)', // Darker for data
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 255, 255, 0.2)', // Cyan tint
                    boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    fontFamily: 'monospace',
                    color: '#00ffff',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto',
                }}
            >
                <div style={{ 
                    fontSize: '10px', 
                    opacity: 0.7, 
                    marginBottom: '10px', 
                    borderBottom: '1px solid rgba(0,255,255,0.2)',
                    paddingBottom: '5px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>DATA_STREAM</span>
                    <span>ID: {id.split('-').pop()}</span>
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.4', minHeight: '60px' }}>
                    {displayedText}
                    <span style={{ animation: 'blink 1s infinite' }}>_</span>
                </div>
            </div>
        </Html>
    );
};
