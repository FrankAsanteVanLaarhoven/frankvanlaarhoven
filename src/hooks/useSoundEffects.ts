import { useCallback, useRef, useEffect } from 'react';

export function useSoundEffects() {
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction if needed
    // but browsers often block it until interaction.
    // We'll init it lazily in the play functions.
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
        audioContext.current = new AudioContextClass();
    }
  }, []);

  const playOscillator = useCallback((freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number, vol = 0.1) => {
    if (!audioContext.current) return;
    
    // Resume context if suspended (browser requirements)
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }

    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);
    
    gain.gain.setValueAtTime(vol, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.current.destination);

    osc.start();
    osc.stop(audioContext.current.currentTime + duration);
  }, []);

  const playHover = useCallback(() => {
    // High tech chirp
    // playOscillator(2000, 'sine', 0.1, 0.05);
    // Let's make it more subtle:
    if (!audioContext.current) return;
    const t = audioContext.current.currentTime;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
    
    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(t + 0.05);
  }, []);

  const playClick = useCallback(() => {
    // Mechanical click
    playOscillator(300, 'square', 0.1, 0.05);
  }, [playOscillator]);

  const playOpen = useCallback(() => {
    // Swell
    if (!audioContext.current) return;
    const t = audioContext.current.currentTime;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.3);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);
    
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(t + 0.3);
  }, []);

  return { playHover, playClick, playOpen };
}
