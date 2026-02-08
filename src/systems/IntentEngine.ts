
import { ASSET_LIBRARY } from '../config/assets';

export type IntentType = 'analyze' | 'design' | 'diagnose' | 'system' | 'clear' | 'idle';

export interface WidgetConfig {
  id: string;
  type: 'display' | 'control' | 'data';
  assetUrl: string;
  position: [number, number, number]; // x, y, z
  rotY: number;
  scale: number;
  delay: number; // For staggered animation
  content?: string; // For data widgets
}

export interface UIBlueprint {
  intent: IntentType;
  widgets: WidgetConfig[];
}

// Logic to map keywords to intents (Local fast-path)
export function processIntent(transcript: string): IntentType {
  const t = transcript.toLowerCase();
  if (t.includes('analyze') || t.includes('scan') || t.includes('data')) return 'analyze';
  if (t.includes('design') || t.includes('create') || t.includes('build')) return 'design';
  if (t.includes('diagnose') || t.includes('fix') || t.includes('repair')) return 'diagnose';
  if (t.includes('system') || t.includes('status') || t.includes('report')) return 'system';
  if (t.includes('clear') || t.includes('close') || t.includes('hide')) return 'clear';
  return 'idle'; // Default
}

// AI-Powered Intent Resolution
export async function resolveIntentWithAI(transcript: string, lang: string = 'en'): Promise<IntentType> {
    // 1. Try local fast-path first
    const localIntent = processIntent(transcript);
    if (localIntent !== 'idle') return localIntent;

    // 2. Fallback to LLM
    try {
        const response = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: transcript, lang })
        });
        const data = await response.json();
        
        // Map Agent Action to Intent
        if (data.action) {
             if (data.action === 'analyze') return 'analyze';
             if (data.action === 'design') return 'design';
             if (data.action === 'diagnose') return 'diagnose';
             if (data.action === 'system') return 'system';
             if (data.action === 'close' || data.action === 'clear') return 'clear';
        }
        
        return 'idle';
    } catch (e) {
        console.warn("AI Intent Resolution Failed", e);
        return 'idle';
    }
}

// Generative UI Logic
export function generateBlueprint(intent: IntentType): UIBlueprint {
  if (intent === 'clear' || intent === 'idle') {
    return { intent, widgets: [] };
  }

  // Get random assets from PNG library for now (web safe)
  const assets = ASSET_LIBRARY.png;
  // 3 to 6 widgets
  const count = 3 + Math.floor(Math.random() * 4); 
  const widgets: WidgetConfig[] = [];

  // Arc Configuration
  const radius = 2.5; 
  const arcSpan = Math.PI / 1.5; // 120 degrees
  const startAngle = -arcSpan / 2;

  for (let i = 0; i < count; i++) {
    // Distribute along an arc in front of the user
    // i / (count - 1) gives 0..1
    const t = count > 1 ? i / (count - 1) : 0.5;
    const angle = startAngle + (t * arcSpan);
    
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius; // In Three.js usually -z is forward, but logic varies. We'll adjust in component if needed.
    // Actually typically camera looks down -Z. So we want Z to be typical distance. 
    // Let's assume camera at 0,0,5 looking at 0,0,0.
    
    // Random height variation
    const y = 0 + (Math.random() * 1.0 - 0.5); 

    // Special case: Make the center widget a DATA widget for Analyze/Diagnose
    const isCenter = Math.abs(t - 0.5) < 0.1;
    if (isCenter && (intent === 'analyze' || intent === 'diagnose')) {
        widgets.push({
            id: `widget-${intent}-${Date.now()}-${i}`,
            type: 'data',
            content: intent === 'analyze' ? "System Scan: OPTIMAL\nThreats: NONE\nLatency: 12ms" : "Diagnostics:\n- Motor A: 98%\n- Sensors: CALIBRATED\n- Vision: ACTIVE",
            assetUrl: '', // Not used for data
            position: [x, y, z],
            rotY: -angle,
            scale: 1, // Standard scale
            delay: i * 0.15 + 0.5 // Slightly later
        });
        continue;
    }

    widgets.push({
      id: `widget-${intent}-${Date.now()}-${i}`,
      type: 'display',
      assetUrl: assets[Math.floor(Math.random() * assets.length)],
      position: [x, y, z], // Z is now used
      rotY: -angle, // Face center
      scale: 0.8 + Math.random() * 0.4,
      delay: i * 0.15 // Staggered entrance
    });
  }

  return { intent, widgets };
}
