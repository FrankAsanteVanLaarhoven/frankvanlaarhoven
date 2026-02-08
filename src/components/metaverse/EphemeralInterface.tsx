import React, { useState, useEffect } from 'react';
// import { useThree } from '@react-three/fiber'; // Unused
import { Html } from '@react-three/drei';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { EphemeralWidget } from '../ui/EphemeralWidget';
import { DataWidget } from '../ui/DataWidget';
import { processIntent, resolveIntentWithAI, generateBlueprint, UIBlueprint, IntentType } from '../../systems/IntentEngine'; 
import styles from '../ui/HolographicOS.module.scss'; // Assuming this exists, if not we'll inline styles or fix

export default function EphemeralInterface() {
  // const { camera } = useThree(); // Unused
  
  // Fix: Provide required arguments to useVoiceCommands
  const { 
    transcript, 
    isListening, 
    startTheSystem, 
    stopTheSystem 
  } = useVoiceCommands({
    // We use the transcript effect below, but hook requires this callback
    onCommand: (cmd) => console.log("[VoiceCommand]", cmd),
    language: 'en-US'
  });
  
  // State for dynamic UI
  const [currentBlueprint, setCurrentBlueprint] = useState<UIBlueprint | null>(null);
  const [activeIntent, setActiveIntent] = useState<IntentType>('idle');

  const handleIntentChange = (newIntent: IntentType) => {
      setActiveIntent(newIntent);
      const blueprint = generateBlueprint(newIntent);
      setCurrentBlueprint(blueprint);
  };

  // Effect: Process Voice Transcript into Intent
  useEffect(() => {
     if (!transcript) return;

     // 1. Fast Local Check
     const localIntent = processIntent(transcript);
     if (localIntent !== 'idle') {
         if (localIntent !== activeIntent) {
             console.log(`[IntentEngine] Local Detect: ${localIntent}`);
             handleIntentChange(localIntent);
         }
         return;
     }

     // 2. Slow AI Check (Debounced)
     // Only query AI if we can't find a local match and user pauses
     const timer = setTimeout(async () => {
         console.log(`[IntentEngine] Querying AI for: "${transcript}"`);
         const aiIntent = await resolveIntentWithAI(transcript);
         if (aiIntent !== 'idle' && aiIntent !== activeIntent) {
             console.log(`[IntentEngine] AI Detect: ${aiIntent}`);
             handleIntentChange(aiIntent);
         }
     }, 1200); // 1.2s debounce

     return () => clearTimeout(timer);
  }, [transcript, activeIntent]);

  return (
    <group>
      {/* 1. Voice Feedback HUD (Fixed to Camera or floating) */}
      <Html position={[0, -1.5, -2]} center transform>
          <div className={`${styles.voiceFeedback} ${isListening ? styles.listening : ''}`}>
             <div 
                className={styles.micIcon} 
                onClick={isListening ? stopTheSystem : startTheSystem}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { 
                    if (e.key === 'Enter' || e.key === ' ') {
                        isListening ? stopTheSystem() : startTheSystem(); 
                    }
                }}
             >
                 {isListening ? 'Listening...' : 'Mic Off'}
             </div>
             <div className={styles.transcript}>{transcript || "Say 'Analyze', 'Design', 'Diagnose'..."}</div>
          </div>
      </Html>

      {/* 2. Manual Test Controls (Bottom HUD) */}
      <Html position={[0, -2.5, -3]} center transform>
          <div className={styles.intentControls}>
              <button 
                onClick={() => handleIntentChange('analyze')} 
                className={activeIntent === 'analyze' ? styles.active : ''}
              >
                ANALYZE
              </button>
              <button 
                onClick={() => handleIntentChange('design')} 
                className={activeIntent === 'design' ? styles.active : ''}
              >
                DESIGN
              </button>
              <button 
                onClick={() => handleIntentChange('diagnose')} 
                className={activeIntent === 'diagnose' ? styles.active : ''}
              >
                DIAGNOSE
              </button>
              <button 
                onClick={() => handleIntentChange('clear')} 
                className={styles.clearBtn}
              >
                CLEAR
              </button>
          </div>
      </Html>

      {/* 3. Render Dynamic Widgets from Blueprint */}
      {currentBlueprint && currentBlueprint.widgets.map((widget) => {
          if (widget.type === 'data') {
              return (
                  <DataWidget 
                    key={widget.id}
                    id={widget.id}
                    content={widget.content}
                    position={[widget.position[0], widget.position[1], -4]}
                    scale={widget.scale}
                    rotationY={widget.rotY}
                    delay={widget.delay}
                  />
              );
          }
          return (
            <EphemeralWidget 
                key={widget.id}
                assetUrl={widget.assetUrl}
                position={[widget.position[0], widget.position[1], -4]} // Force Z depth for consistency
                scale={widget.scale}
                rotationY={widget.rotY || 0}
                delay={widget.delay}
            />
          );
      })}
    </group>
  );
}
