"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import styles from "./HolographicOS.module.scss";
import { useVoiceCommands, LanguageCode } from "../../hooks/useVoiceCommands";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import FrankyAvatar from "../3d/FrankyAvatar";
import DidAvatar from "../3d/DidAvatar";

type WindowId = "books" | "services" | "terminal" | "research" | "comms" | "projects" | "presence" | null;

export default function HolographicOS() {
  const [activeWindow, setActiveWindow] = useState<WindowId>(null);
  const [language, setLanguage] = useState<LanguageCode>('en-US');


  const toggleWindow = (id: WindowId) => {
    setActiveWindow(activeWindow === id ? null : id);
  };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const langCode = language.split('-')[0];
        const preferredVoice = voices.find(v => v.lang.startsWith(langCode) && v.name.includes("Google")) 
                            || voices.find(v => v.lang.startsWith(langCode)) 
                            || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleVoiceCommand = useCallback(async (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();

    // Language Switching
    if (lowerCmd.includes("english") || lowerCmd.includes("englisch")) { setLanguage('en-US'); speak("English selected."); return; }
    if (lowerCmd.includes("german") || lowerCmd.includes("deutsch")) { setLanguage('de-DE'); speak("Deutsch ausgewählt."); return; }
    if (lowerCmd.includes("dutch") || lowerCmd.includes("nederlands")) { setLanguage('nl-NL'); speak("Nederlands geselecteerd."); return; }
    if (lowerCmd.includes("spanish") || lowerCmd.includes("español")) { setLanguage('es-ES'); speak("Español seleccionado."); return; }
    if (lowerCmd.includes("portuguese") || lowerCmd.includes("português")) { setLanguage('pt-BR'); speak("Português selecionado."); return; }
    if (lowerCmd.includes("chinese") || lowerCmd.includes("zhongwen")) { setLanguage('zh-CN'); speak("中文已选择。"); return; }
    if (lowerCmd.includes("arabic") || lowerCmd.includes("arabiyya")) { setLanguage('ar-SA'); speak("تم اختيار العربية."); return; }

    // 1. Fast Local Logic
    if (language === 'en-US') {
        if (lowerCmd.includes("open books") || lowerCmd.includes("nexus books")) { speak("Accessing Neural Archives."); setActiveWindow("books"); return; }
        if (lowerCmd.includes("open services") || lowerCmd.includes("vla services")) { speak("Connecting to Services."); setActiveWindow("services"); return; }
        if (lowerCmd.includes("open research") || lowerCmd.includes("research lab")) { speak("Decrypting Data."); setActiveWindow("research"); return; }
        if (lowerCmd.includes("open projects") || lowerCmd.includes("show portfolio") || lowerCmd.includes("my startups")) { speak("Accessing Project Archives."); setActiveWindow("projects"); return; }
        if (lowerCmd.includes("open communications") || lowerCmd.includes("open contact")) { speak("Opening Secure Channel."); setActiveWindow("comms"); return; }
        if (lowerCmd.includes("activate presence") || lowerCmd.includes("video link")) { speak("Establishing Video Uplink."); setActiveWindow("presence"); return; }
        if (lowerCmd.includes("open terminal")) { speak("Initializing CLI."); setActiveWindow("terminal"); return; }
        if (lowerCmd.includes("close") || lowerCmd.includes("close all")) { speak("Terminating sessions."); setActiveWindow(null); return; }
    }

    // 2. Intelligent Agent (Multilingual)
    try {
        const langCode = language.split('-')[0] as any;
        const response = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: lowerCmd, lang: langCode })
        });
        
        const data = await response.json();
        
        if (data.text) speak(data.text);
        
        if (data.action) {
            if (data.action === 'close') setActiveWindow(null);
            else setActiveWindow(data.action);
        }
    } catch (e) {
        console.error("Agent Error:", e);
        speak("Error.");
    }
  }, [language, speak]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const { isListening, isSupported, startTheSystem, stopTheSystem, interimTranscript, voiceMode, isSpeaking } = useVoiceCommands({ onCommand: handleVoiceCommand, language });
  const { playHover, playClick } = useSoundEffects();

  return (
    <div className={styles.osLayer}>
      {/* Dynamic "Ephemeral" Toolbar */}
      <nav className={styles.toolbar}>
        {/* Real-time Voice Feedback Display */}
        {voiceMode !== 'OFF' && (
            <div className={styles.voiceFeedback}>
                <span className={`${styles.waveform} ${voiceMode === 'ACTIVE' ? styles.active : ''}`}>
                    {voiceMode === 'ACTIVE' ? '||||||||' : '...'}
                </span>
                <span className={styles.transcript}>
                    {voiceMode === 'STANDBY' ? "Waiting for 'Franky'..." : (interimTranscript || "Listening...")}
                </span>
            </div>
        )}

        {isSupported && (
            <button 
                onClick={() => { 
                    playClick(); 
                    if (voiceMode === 'OFF') startTheSystem();
                    else stopTheSystem();
                }} 
                onMouseEnter={playHover}
                className={`${styles.toolButton} ${voiceMode !== 'OFF' ? styles.listening : ''}`} 
                style={voiceMode === 'ACTIVE' ? { color: '#00ff9d', textShadow: '0 0 10px #00ff9d' } : {}}
            >
                <span className={styles.icon}>{voiceMode === 'OFF' ? '🔇' : (voiceMode === 'ACTIVE' ? '🎙️' : '👂')}</span>
                {/* Show Language Code */}
                <span className={styles.label}>
                    {voiceMode === 'OFF' ? 'INIT SYSTEM' : (voiceMode === 'ACTIVE' ? 'LISTENING' : 'STANDBY')} [{language.split('-')[0].toUpperCase()}]
                </span>
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
            onClick={() => { playClick(); toggleWindow("projects"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Open Projects"
        >
          <span className={styles.icon}>💼</span>
          <span className={styles.label}>PROJECTS</span>
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
            onClick={() => { playClick(); toggleWindow("comms"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Open Communications"
        >
          <span className={styles.icon}>📡</span>
          <span className={styles.label}>COMM_LINK</span>
        </button>
        <button 
            onClick={() => { playClick(); toggleWindow("presence"); }} 
            onMouseEnter={playHover}
            className={styles.toolButton} 
            aria-label="Toggle Presence"
        >
          <span className={styles.icon}>🎥</span>
          <span className={styles.label}>PRESENCE</span>
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
        {/* FRANKY 3D AVATAR (Bottom Right Companion) */}
        <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            right: '20px', 
            width: '150px', 
            height: '150px', 
            pointerEvents: 'none',
            zIndex: 100 
        }}>
            <FrankyAvatar voiceMode={voiceMode} isSpeaking={isSpeaking} />
        </div>
        
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
                 <button className={styles.actionLink} onClick={() => window.open('https://www.amazon.co.uk/s?k=the+cognitive+divide&crid=30GCNNFXOR5FH&sprefix=the+cognitive+divide%2Caps%2C101&ref=nb_sb_noss', '_blank')}>READ_ON_AMAZON</button>
               </div>
               <div className={styles.bookItem}>
                 <h4>Navigation Bible</h4>
                 <p>&quot;Universal Navigation Principle for Autonomous Agents.&quot;</p>
                 <button className={styles.actionLink} onClick={() => window.open('https://www.amazon.co.uk/NAVIGATION-BIBLE-UNIVERSAL-PRINCIPLE-Universal-ebook/dp/B0FQRPD1QH?ref_=ast_author_mpb', '_blank')}>READ_ON_AMAZON</button>
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
               <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button className={styles.actionLink} onClick={() => window.location.href = 'mailto:safevla-robots@frankvanlaarhoven.com'}>REQUEST_SAFETY_AUDIT</button>
                  <button className={styles.actionLink} onClick={() => window.location.href = 'mailto:consultancy@frankvanlaarhoven.com'}>CONSULTING_INQUIRY</button>
               </div>
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
               <button className={styles.actionLink} style={{width: '100%', marginTop: '10px'}} onClick={() => window.location.href = 'mailto:research@frankvanlaarhoven.com'}>
                  COLLABORATE_ON_RESEARCH
               </button>
               <div className={styles.statusBox} style={{ borderColor: '#7d5fff', color: '#7d5fff', background: 'rgba(125, 95, 255, 0.05)' }}>
                 SECURITY_LEVEL: OMEGA
                 <br/>&gt; DECRYPTING_VLA_ARCHIVES...
               </div>
            </div>
          </motion.div>
        )}

        {/* Projects Module */}
        {activeWindow === "projects" && (
            <motion.div
                className={`${styles.window} ${styles.glassPanel}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                drag
                style={{ width: '500px' }} // Wider for portfolio
            >
                <div className={styles.windowHeader}>
                    <h3>PROJECT_ARCHIVES_V1</h3>
                    <div className={styles.windowControls}>
                        <span className={styles.close} onClick={() => setActiveWindow(null)}>×</span>
                    </div>
                </div>
                <div className={styles.windowContent} style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    
                    {/* Startups Section */}
                    <h4 style={{ borderBottom: '1px solid rgba(0, 255, 157, 0.3)', paddingBottom: '5px', marginBottom: '10px', color: '#00ff9d' }}>STARTUP_VENTURES</h4>
                    <ul className={styles.serviceList}>
                        <li><a href="https://oracleiqtrader.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>🔮 OracleIQ Trader</a></li>
                        <li><a href="https://atlassupplychainos.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>🌍 Atlas Supply Chain OS</a></li>
                        <li><a href="https://nava-ai.cloud" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>🧠 NAVA AI Cloud</a></li>
                        <li><a href="https://aethonai.io" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>🦅 Aethon AI</a></li>
                        <li><a href="https://retrofitforge.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>⚙️ Retrofit Forge</a></li>
                    </ul>

                    {/* SaaS Section */}
                    <h4 style={{ borderBottom: '1px solid rgba(0, 204, 255, 0.3)', paddingBottom: '5px', marginTop: '20px', marginBottom: '10px', color: '#00ccff' }}>SaaS_PLATFORMS</h4>
                    <ul className={styles.serviceList}>
                        <li><a href="https://rovyn.io" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>☁️ Rovyn.io</a></li>
                        <li><a href="https://telixar.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>📡 Telixar</a></li>
                    </ul>

                    {/* Personal Section */}
                    <h4 style={{ borderBottom: '1px solid rgba(255, 0, 255, 0.3)', paddingBottom: '5px', marginTop: '20px', marginBottom: '10px', color: '#ff00ff' }}>PERSONAL_INITIATIVES</h4>
                    <ul className={styles.serviceList}>
                        <li><a href="https://frankvanlaarhoven.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>👨‍💻 Frank van Laarhoven</a></li>
                        <li><a href="https://cognitivedivideai.com" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>🧩 Cognitive Divide AI</a></li>
                        <li><a href="https://programmingintelligence.org" target="_blank" rel="noopener noreferrer" className={styles.actionLink} style={{display:'block', textAlign:'left'}}>🎓 Programming Intelligence</a></li>
                    </ul>

                </div>
            </motion.div>
        )}

        {/* Communications Module */}
        {activeWindow === "comms" && (
            <motion.div
                className={`${styles.window} ${styles.glassPanel}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                drag
            >
                <div className={styles.windowHeader}>
                    <h3>SECURE_COMM_LINK</h3>
                    <div className={styles.windowControls}>
                        <span className={styles.close} onClick={() => setActiveWindow(null)}>×</span>
                    </div>
                </div>
                <div className={styles.windowContent}>
                    <div className={styles.bookItem}>
                        <h4>General Inquiries</h4>
                        <p style={{marginBottom: '5px'}}>System Access & General Information.</p>
                        <button className={styles.actionLink} onClick={() => window.location.href = 'mailto:contact@frankvanlaarhoven.com'}>CONTACT_SYSTEM</button>
                    </div>
                    <div className={styles.bookItem}>
                        <h4>Direct Uplink</h4>
                        <p style={{marginBottom: '5px'}}>Priority Channel for Urgent Matters.</p>
                        <button className={styles.actionLink} onClick={() => window.location.href = 'mailto:frank@frankvanlaarhoven.com'}>CONTACT_FRANK</button>
                    </div>
                        <div className={styles.bookItem}>
                            <h4>Technical Support</h4>
                            <p style={{marginBottom: '5px'}}>Bug Reports & Integration.</p>
                            <button className={styles.actionLink} onClick={() => window.location.href = 'mailto:support@frankvanlaarhoven.com'}>GET_SUPPORT</button>
                        </div>

                        <div className={styles.bookItem} style={{marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px'}}>
                            <h4>Secure Uplinks</h4>
                            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                <button className={styles.actionLink} onClick={() => window.open('https://www.linkedin.com/in/frank-van-laarhoven-cognitive-divide/', '_blank')}>LINKEDIN_PROFILE</button>
                                <button className={styles.actionLink} onClick={() => window.location.href = 'tel:+07481872197'}>MOBILE_UPLINK</button>
                            </div>
                        </div>

                        <div className={styles.bookItem}>
                             <h4>Media Feeds</h4>
                             <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                <button className={styles.actionLink} onClick={() => window.open('https://www.youtube.com/results?search_query=safevla-robots', '_blank')}>YOUTUBE [SAFEVLA]</button>
                                <button className={styles.actionLink} onClick={() => window.open('https://twitter.com/search?q=Frank%20van%20Laarhoven', '_blank')}>X_FEED [SEARCH]</button>
                             </div>
                        </div>
                     <div className={styles.statusBox} style={{ borderColor: '#00ccff', color: '#00ccff', background: 'rgba(0, 204, 255, 0.05)' }}>
                        ENCRYPTION: AES-256
                        <br/>&gt; CHANNEL_OPEN...
                    </div>
                </div>
            </motion.div>
        )}

        {/* D-ID Presence Interface */}
        <DidAvatar isActive={activeWindow === "presence"} onClose={() => setActiveWindow(null)} />

        {/* Terminal / Command Line Interface */}
        {activeWindow === "terminal" && (
            <motion.div
                className={`${styles.window} ${styles.terminalPanel}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                drag
                dragMomentum={false}
            >
                <div className={styles.windowHeader}>
                    <h3>COMMAND_INTERFACE_V1</h3>
                    {/* Move Close button to ensure it's clickable and visible */}
                    <div className={styles.windowControls}>
                        <span className={styles.close} onClick={() => setActiveWindow(null)}>× CLOSE</span>
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
