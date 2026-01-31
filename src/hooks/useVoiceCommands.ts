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
}

export function useVoiceCommands({ onCommand }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Use a ref to keep one instance of SpeechRecognition
  const recognitionRef = (typeof window !== 'undefined') ? 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<{ current: SpeechRecognition | null }>({ current: null })[0] : 
    { current: null };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setIsSupported(true);
      
      // Initialize the recognition instance once
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; // Capture one command at a time
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        setTranscript(text);
        console.log('Voice Command:', text);
        onCommand(text);
        setIsListening(false); // It stops automatically after result
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onCommand]); // Re-bind if onCommand changes, though simpler to use a ref for onCommand if it changes often

  const toggleListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition start error:", e);
      }
    }
  }, [isListening, isSupported]);

  return { isListening, isSupported, transcript, toggleListening };
}
