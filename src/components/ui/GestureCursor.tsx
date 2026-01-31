"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./GestureCursor.module.scss";

export default function GestureCursor() {
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // specific spring config for that "robotic" lag feel
  const springConfig = { damping: 25, stiffness: 400 };
  const pointX = useSpring(mouseX, springConfig);
  const pointY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style.cursor === "pointer";
      
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className={styles.cursorDot}
        style={{ x: mouseX, y: mouseY }}
        animate={{
            scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
            backgroundColor: isHovering ? "#00ff88" : "#ffffff"
        }}
      />
      
      {/* Trailing Ring */}
      <motion.div
        className={styles.cursorRing}
        style={{ x: pointX, y: pointY }}
        animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
            opacity: isHovering ? 0.8 : 0.4,
            borderColor: isHovering ? "#00ff88" : "var(--color-accent)"
        }}
      />
    </>
  );
}
