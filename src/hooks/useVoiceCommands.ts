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

export function useVoiceCommands({ onCommand, language }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use a ref to keep one instance of SpeechRecognition
  const recognitionRef = (typeof window !== 'undefined') ? 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<{ current: SpeechRecognition | null }>({ current: null })[0] : 
    { current: null };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        
        // Find a voice that matches the current language
        const langCode = language.split('-')[0]; // 'en', 'de', etc.
        const preferredVoice = voices.find(v => v.lang.startsWith(langCode) && v.name.includes("Google")) 
                            || voices.find(v => v.lang.startsWith(langCode))
                            || voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; 
      recognition.interimResults = true; 
      recognition.lang = language; // Dynamic language from prop

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
            } else {
                interim += event.results[i][0].transcript;
            }
        }
        
        if (interim) setInterimTranscript(interim);
        
        if (final) {
            const text = final.toLowerCase();
            setTranscript(text);
            setInterimTranscript(''); 
            console.log('Voice Command:', text);
            onCommand(text);
            setIsListening(false); 
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      
      return () => {
        recognition.abort();
      };
    }
  }, [onCommand, language]);

  const toggleListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setInterimTranscript('');
        if (recognitionRef.current) recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition start error:", e);
      }
    }
  }, [isListening, isSupported, language]);

  return { isListening, isSupported, transcript, interimTranscript, toggleListening, speak, isSpeaking };
}
