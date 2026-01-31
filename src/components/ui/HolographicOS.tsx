"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./HolographicOS.module.scss";
import { useVoiceCommands } from "../../hooks/useVoiceCommands";
import { useSoundEffects } from "../../hooks/useSoundEffects";

type WindowId = "books" | "services" | "terminal" | "research" | null;

export default function HolographicOS() {
  const [activeWindow, setActiveWindow] = useState<WindowId>(null);

  const toggleWindow = (id: WindowId) => {
    setActiveWindow(activeWindow === id ? null : id);
  };

  const handleVoiceCommand = (cmd: string) => {
    if (cmd.includes("open books") || cmd.includes("nexus books")) setActiveWindow("books");
    if (cmd.includes("open services") || cmd.includes("vla services")) setActiveWindow("services");
    if (cmd.includes("open research") || cmd.includes("research lab")) setActiveWindow("research");
    if (cmd.includes("open terminal") || cmd.includes("command line")) setActiveWindow("terminal");
    if (cmd.includes("close") || cmd.includes("close all")) setActiveWindow(null);
  };



  const { isListening, isSupported, toggleListening } = useVoiceCommands({ onCommand: handleVoiceCommand });
  const { playHover, playClick } = useSoundEffects();

  return (
    <div className={styles.osLayer}>
      {/* Dynamic "Ephemeral" Toolbar */}
      <nav className={styles.toolbar}>
        {isSupported && (
            <button 
                onClick={() => { playClick(); toggleListening(); }} 
                onMouseEnter={playHover}
                className={`${styles.toolButton} ${isListening ? styles.listening : ''}`} 
                aria-label={isListening ? "Stop Voice Control" : "Start Voice Control"}
                style={isListening ? { color: '#ff5f5f', textShadow: '0 0 10px #ff5f5f' } : {}}
            >
                <span className={styles.icon}>{isListening ? '🎙️' : '🎤'}</span>
                <span className={styles.label}>{isListening ? 'LISTENING...' : 'VOICE_CMD'}</span>
            </button>
        )}
        <button 
            onClick={() => { playClick(); toggleWindow("books"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Open Nexus Books"
        >
          <span className={styles.icon}>📚</span>
          <span className={styles.label}>NEXUS_BOOKS</span>
        </button>
        <button 
            onClick={() => { playClick(); toggleWindow("research"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Open Research Lab"
        >
          <span className={styles.icon}>🔬</span>
          <span className={styles.label}>RESEARCH_LAB</span>
        </button>
        <button 
            onClick={() => { playClick(); toggleWindow("services"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Open VLA Services"
        >
          <span className={styles.icon}>🤖</span>
          <span className={styles.label}>VLA_SERVICES</span>
        </button>
        <button 
            onClick={() => { playClick(); toggleWindow("terminal"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Open Command Line"
        >
          <span className={styles.icon}>_</span>
          <span className={styles.label}>CMD_LINE</span>
        </button>
      </nav>

      {/* Constraints for drag */}
      <div className={styles.desktopArea}>
        
        {/* Books Module */}
        {activeWindow === "books" && (
          <motion.div 
            className={`${styles.window} ${styles.glassPanel}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            drag
            dragElastic={0.2}
          >
            <div className={styles.windowHeader}>
              <h3>THE_COGNITIVE_DIVIDE</h3>
              <div className={styles.windowControls}>
                <span className={styles.close} onClick={() => setActiveWindow(null)}>×</span>
              </div>
            </div>
            <div className={styles.windowContent}>
               <div className={styles.bookItem}>
                 <h4>The Cognitive Divide</h4>
                 <p>&quot;Re-conceptualising programming in the Era of AI.&quot;</p>
                 <button className={styles.actionLink} onClick={() => alert('ACCESSING_HOLOGRAM: COGNITIVE_DIVIDE_V1')}>READ_HOLOGRAM</button>
               </div>
               <div className={styles.bookItem}>
                 <h4>Navigation Bible</h4>
                 <p>&quot;Universal Navigation Principle for Autonomous Agents.&quot;</p>
                 <button className={styles.actionLink} onClick={() => alert('ACCESSING_HOLOGRAM: NAV_BIBLE_ALPHA')}>READ_HOLOGRAM</button>
               </div>
               <div className={styles.statusBox} style={{ marginTop: 'auto', fontSize: '0.8rem' }}>
                 STATUS: ARCHIVED_IN_Permanent_Storage
               </div>
            </div>
          </motion.div>
        )}

        {/* Services Module */}
        {activeWindow === "services" && (
          <motion.div 
            className={`${styles.window} ${styles.glassPanel}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            drag
          >
             <div className={styles.windowHeader}>
              <h3>VLA_ROBOTICS_SERVICES</h3>
              <div className={styles.windowControls}>
                <span className={styles.close} onClick={() => setActiveWindow(null)}>×</span>
              </div>
            </div>
            <div className={styles.windowContent}>
               <ul className={styles.serviceList}>
                 <li>
                    <strong>VLA Safety Protocols</strong>
                    <br/><span style={{opacity:0.7, fontSize:'0.8em'}}>ISO-26262 / SOTIF Compliance Checks</span>
                 </li>
                 <li>
                    <strong>AI Assurance Consulting</strong>
                    <br/><span style={{opacity:0.7, fontSize:'0.8em'}}>Verification of LLM/VLA outputs.</span>
                 </li>
                 <li>
                    <strong>Cloud Architectures</strong>
                    <br/><span style={{opacity:0.7, fontSize:'0.8em'}}>Scalable ROS 2 Swarm Infrastructure.</span>
                 </li>
               </ul>
               <button className={styles.actionLink} onClick={() => alert('INITIATING_SECURE_Handshake...')}>INITIATE_CONTACT_PROTOCOL</button>
               <div className={styles.statusBox}>
                 &quot;Can your robot check safety before it moves?&quot;
                 <br/>&gt; VLA_GUARD_ACTIVE...
               </div>
            </div>
          </motion.div>
        )}

        {/* Research Module */}
        {activeWindow === "research" && (
          <motion.div 
            className={`${styles.window} ${styles.glassPanel}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            drag
          >
             <div className={styles.windowHeader}>
              <h3>VLA_RESEARCH_LAB</h3>
              <div className={styles.windowControls}>
                <span className={styles.close} onClick={() => setActiveWindow(null)}>×</span>
              </div>
            </div>
            <div className={styles.windowContent}>
               <div className={styles.bookItem}>
                 <h4>Safe RL in Unstructured Environments</h4>
                 <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px' }}>Paper • 2025 • IEEE ICRA</div>
                 <p>&quot;Constrained optimization for robotic manipulators in domestic settings.&quot;</p>
                 <button className={styles.actionLink} onClick={() => alert('DOWNLOADING_ENCRYPTED_PDF...')}>ACCESS_DATA</button>
               </div>
               <div className={styles.bookItem}>
                 <h4>Human-Robot Alignment via Haptic Feedback</h4>
                 <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px' }}>Project • MIT Media Lab Collab</div>
                 <p>&quot;Latency-free force feedback for teleoperation safety.&quot;</p>
                 <button className={styles.actionLink} onClick={() => alert('OPENING_SIMULATION_STREAM...')}>VIEW_SIMULATION</button>
               </div>
               <div className={styles.statusBox} style={{ borderColor: '#7d5fff', color: '#7d5fff', background: 'rgba(125, 95, 255, 0.05)' }}>
                 SECURITY_LEVEL: OMEGA
                 <br/>&gt; DECRYPTING_VLA_ARCHIVES...
               </div>
            </div>
          </motion.div>
        )}

        {/* Terminal / Command Line Interface */}
        {activeWindow === "terminal" && (
            <motion.div
                className={`${styles.window} ${styles.terminalPanel}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                drag
            >
                <div className={styles.windowHeader}>
                    <h3>COMMAND_INTERFACE_V1</h3>
                    <div className={styles.windowControls}>
                        <span className={styles.close} onClick={() => setActiveWindow(null)}>×</span>
                    </div>
                </div>
                <div className={styles.terminalContent}>
                    <div className={styles.terminalOutput}>
                        <p>&gt; SYSTEM_READY...</p>
                        <p>&gt; LISTENING_FOR_INTENT...</p>
                        <p className={styles.hint}>Try: &quot;open books&quot;, &quot;open services&quot;, &quot;status&quot;</p>
                    </div>
                    <div className={styles.inputLine}>
                        <span className={styles.prompt}>user@nexus:~$</span>
                        <input 
                            type="text" 
                            className={styles.cmdInput} 
                            placeholder="Type command..."
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = e.currentTarget.value.trim().toLowerCase();
                                    e.currentTarget.value = '';
                                    if (val === 'open books') setActiveWindow('books');
                                    if (val === 'open services') setActiveWindow('services');
                                    if (val === 'status') alert('SYSTEM STATUS: OPTIMAL');
                                    // In a real app, we'd append the command to the output history
                                }
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}
