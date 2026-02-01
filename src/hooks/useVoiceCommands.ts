import { useState, useEffect, useCallback } from 'react';

// Define the type for the SpeechRecognition API (not in standard TS yet)
interface SpeechRecognitionResult {
  isFinal: boolean;
  [key: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceCommandProps {
  onCommand: (command: string) => void;
  language: LanguageCode;
}

export type LanguageCode = 'en-US' | 'de-DE' | 'nl-NL' | 'es-ES' | 'pt-BR' | 'zh-CN' | 'ar-SA';
export type VoiceMode = 'OFF' | 'STANDBY' | 'ACTIVE';

export function useVoiceCommands({ onCommand, language }: VoiceCommandProps) {
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('OFF');
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = (typeof window !== 'undefined') ? 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<{ current: SpeechRecognition | null }>({ current: null })[0] : 
    { current: null };

  const activeTimeoutRef = (typeof window !== 'undefined') ?
     // eslint-disable-next-line react-hooks/rules-of-hooks
     useState<{ current: NodeJS.Timeout | null }>({ current: null })[0] :
     { current: null };

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
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const resetToStandby = useCallback(() => {
     setVoiceMode('STANDBY');
     setInterimTranscript('');
     if (activeTimeoutRef.current) clearTimeout(activeTimeoutRef.current);
  }, []);

  const activateAgent = useCallback(() => {
     setVoiceMode('ACTIVE');
     // Play a subtle sound or just UI feedback? 
     // For now relying on UI state change passed back to component
     // Auto-reset after 5 seconds of silence/inactivity
     if (activeTimeoutRef.current) clearTimeout(activeTimeoutRef.current);
     activeTimeoutRef.current = setTimeout(() => {
        resetToStandby();
     }, 8000); 
  }, [resetToStandby]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      // CRITICAL FIX: Assign to ref so startTheSystem can use it
      recognitionRef.current = recognition;

      recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) final += event.results[i][0].transcript;
              else interim += event.results[i][0].transcript;
          }

          const lowerInterim = interim.toLowerCase();
          const lowerFinal = final.toLowerCase();
          const combined = (lowerFinal + " " + lowerInterim).trim();

          // WAKE WORD DETECTION
          if (voiceModeRef.current === 'STANDBY') {
              if (combined.includes('franky') || combined.includes('frankie') || combined.includes('system')) {
                  console.log("Wake Word Detected!");
                  activateAgent();
                  setInterimTranscript("I'm listening...");
                  return;
              } else {
                  setInterimTranscript("Waiting for 'Franky'...");
              }
          } 
          
          // COMMAND PROCESSING
          if (voiceModeRef.current === 'ACTIVE') {
              setInterimTranscript(combined);
              if (final) {
                   const cleanCommand = final.replace(/franky|frankie|system/gi, '').trim();
                   if (cleanCommand.length > 2) {
                       console.log("Command:", cleanCommand);
                       onCommand(cleanCommand);
                       resetToStandby();
                   }
              }
              if (activeTimeoutRef.current) {
                  clearTimeout(activeTimeoutRef.current);
                  activeTimeoutRef.current = setTimeout(resetToStandby, 5000);
              }
          }
      };

      recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') console.error('Voice Error:', event.error);
      };

      recognition.onend = () => {
          if (voiceModeRef.current !== 'OFF') {
              try {
                  recognition.start();
              } catch (e) {
                  // ignore
              }
          }
      };
      
      // Cleanup
      return () => {
          recognition.stop();
      };
    }
  }, [language, activateAgent, resetToStandby, onCommand]);

  const startTheSystem = useCallback(() => {
      if (recognitionRef.current) {
          try {
            setVoiceMode('STANDBY');
            recognitionRef.current.start();
          } catch(e) { console.log(e); }
      }
  }, []);

  const stopTheSystem = useCallback(() => {
      setVoiceMode('OFF');
      recognitionRef.current?.stop();
  }, []);

  const isListening = voiceMode !== 'OFF';

  return { isListening, isSupported, transcript, interimTranscript, startTheSystem, stopTheSystem, speak, isSpeaking, voiceMode };
}
