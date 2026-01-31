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
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use a ref to keep one instance of SpeechRecognition
  const recognitionRef = (typeof window !== 'undefined') ? 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<{ current: SpeechRecognition | null }>({ current: null })[0] : 
    { current: null };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancel any current speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        // Select a futuristic voice if available (usually Google US English or similar)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setIsSupported(true);
      
      // Initialize the recognition instance once
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; // "false" means it stops after one final sentence, which is usually good for commands
      // For "real-time" feel we might want continuous=true, but that requires manual stopping. 
      // Let's stick to false for now but process interim results for visual feedback.
      
      recognition.interimResults = true; // Enable real-time feedback
      recognition.lang = 'en-US';

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
            setInterimTranscript(''); // Clear interim once final
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
  }, [onCommand]); 

  const toggleListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setInterimTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition start error:", e);
      }
    }
  }, [isListening, isSupported]);

  return { isListening, isSupported, transcript, interimTranscript, toggleListening, speak, isSpeaking };
}
