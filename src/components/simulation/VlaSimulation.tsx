"use client";

import React, { useState } from 'react';
import styles from './VlaSimulation.module.scss';
import { 
  Brain, Play, Zap, Loader2, ChevronRight 
} from 'lucide-react';

// Gr00t VLA Skills Library
const VLA_SKILLS = [
  { id: 'pick_object', name: 'Pick Object', category: 'manipulation', complexity: 'medium' },
  { id: 'place_object', name: 'Place Object', category: 'manipulation', complexity: 'medium' },
  { id: 'open_door', name: 'Open Door', category: 'manipulation', complexity: 'high' },
  { id: 'pour_liquid', name: 'Pour Liquid', category: 'manipulation', complexity: 'high' },
  { id: 'walk_forward', name: 'Walk Forward', category: 'locomotion', complexity: 'low' },
  { id: 'turn_around', name: 'Turn Around', category: 'locomotion', complexity: 'low' },
  { id: 'climb_stairs', name: 'Climb Stairs', category: 'locomotion', complexity: 'high' },
  { id: 'wave_hand', name: 'Wave Hand', category: 'gesture', complexity: 'low' },
  { id: 'point_at', name: 'Point At Object', category: 'gesture', complexity: 'medium' },
  { id: 'follow_person', name: 'Follow Person', category: 'navigation', complexity: 'high' },
];

const categories = ['all', 'manipulation', 'locomotion', 'gesture', 'navigation'];

// Mock Inference Logic (Client-side)
const generateInferenceResult = (skill: any, prompt: string) => {
  const actionSequence = [];
  const steps = Math.floor(Math.random() * 5) + 3;
  
  const jointNames = ['left_shoulder', 'left_elbow', 'left_wrist', 'right_shoulder', 'right_elbow', 'right_wrist', 'hip', 'left_knee', 'right_knee'];
  
  for (let i = 0; i < steps; i++) {
    actionSequence.push({
      step: i + 1,
      joints: jointNames.reduce((acc, joint) => ({
        ...acc,
        [joint]: (Math.random() - 0.5) * Math.PI
      }), {}) as Record<string, number>,
      duration: 0.3 + Math.random() * 0.5,
      confidence: 0.85 + Math.random() * 0.14
    });
  }
  
  return {
    skill_id: skill.id,
    skill_name: skill.name,
    prompt,
    action_sequence: actionSequence,
    total_duration: actionSequence.reduce((sum: number, a: any) => sum + a.duration, 0),
    overall_confidence: actionSequence.reduce((sum: number, a: any) => sum + a.confidence, 0) / actionSequence.length,
    model_version: 'gr00t-vla-2.0',
    timestamp: new Date().toISOString()
  };
};

const ActionSequenceViewer = ({ sequence }: { sequence: any[] }) => {
  if (!sequence || sequence.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {sequence.map((action, i) => (
        <div key={i} className={styles.actionStep}>
          <div className={styles.stepHeader}>
            <span>Step {action.step}</span>
            <span>{action.duration.toFixed(2)}s</span>
          </div>
          <div className={styles.jointsGrid}>
            {Object.entries(action.joints).slice(0, 6).map(([joint, value]: [string, any]) => (
              <div key={joint} className={styles.jointRow}>
                <span>{joint.replace('_', ' ')}</span>
                <span className={value >= 0 ? styles.complexityLow : styles.complexityMed}>
                  {value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.stepProgress}>
             <div className={styles.bar} style={{ width: `${action.confidence * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function VlaSimulationPanel() {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [inferenceHistory, setInferenceHistory] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);

  const filteredSkills = activeCategory === 'all' 
    ? VLA_SKILLS 
    : VLA_SKILLS.filter(s => s.category === activeCategory);

  const runInference = async () => {
    if (!selectedSkill) return;
    
    setIsInferring(true);
    setInferenceResult(null);
    
    try {
      const response = await fetch('/api/vla-inference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: selectedSkill,
          prompt: customPrompt || `Execute ${selectedSkill.name}`
        })
      });

      if (!response.ok) {
        throw new Error(`Inference failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Ensure result has all necessary fields for display
      const processedResult = {
        ...result,
        skill_id: selectedSkill.id, // Fallback
        skill_name: selectedSkill.name, // Fallback
        timestamp: result.timestamp || new Date().toISOString()
      };

      setInferenceResult(processedResult);
      setInferenceHistory(prev => [processedResult, ...prev].slice(0, 10));

    } catch (error) {
      console.error("VLA Inference Error:", error);
      // Optional: Fallback to mock if API fails? 
      // For now, let's just log it. We could show an error state in UI.
      alert("Failed to connect to Neural Core (OpenRouter). Please check API Key.");
    } finally {
      setIsInferring(false);
    }
  };

  const executeActions = async () => {
    if (!inferenceResult) return;
    
    setIsExecuting(true);
    setExecutionProgress(0);
    
    const totalSteps = inferenceResult.action_sequence.length;
    
    for (let i = 0; i < totalSteps; i++) {
        const stepDuration = inferenceResult.action_sequence[i].duration * 1000;
        // Break duration into smaller chunks for smoother progress bar
        const chunks = 10;
        for (let j = 0; j <= chunks; j++) {
            await new Promise(r => setTimeout(r, stepDuration / chunks));
            const currentStepProgress = j / chunks;
            const totalProgress = ((i + currentStepProgress) / totalSteps) * 100;
            setExecutionProgress(Math.min(totalProgress, 100));
        }
    }
    
    setIsExecuting(false);
    setExecutionProgress(100);
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
            <div className={styles.logoBox}>
                <Brain size={20} color="#a78bfa" />
            </div>
            <div>
                <h2>NVIDIA Gr00t VLA</h2>
                <p>Vision-Language-Action Model for Robot Skills</p>
            </div>
        </div>
        <div className={styles.badges}>
            <div className={styles.version}>gr00t-vla-2.0</div>
            <div className={styles.mocked} style={{ color: '#00ff9d', borderColor: 'rgba(0,255,157,0.5)', backgroundColor: 'rgba(0,255,157,0.1)' }}>AI-LIVE</div>
        </div>
      </div>

      <div className={styles.contentRow}>
         {/* LEFT PANEL */}
         <div className={styles.leftPanel}>
            <div className={styles.filterBar}>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        className={activeCategory === cat ? styles.active : styles.inactive}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className={styles.skillsList}>
                <div className={styles.sectionLabel}>Available Skills ({filteredSkills.length})</div>
                {filteredSkills.map(skill => (
                    <div 
                        key={skill.id} 
                        className={`${styles.skillItem} ${selectedSkill?.id === skill.id ? styles.selected : ''}`}
                        onClick={() => setSelectedSkill(skill)}
                    >
                        <div className={styles.skillHeader}>
                            <span>{skill.name}</span>
                            <ChevronRight size={14} style={{ transform: selectedSkill?.id === skill.id ? 'rotate(90deg)' : 'none' }} />
                        </div>
                        <div className={styles.meta}>
                            <span>{skill.category}</span>
                            <span className={
                                skill.complexity === 'low' ? styles.complexityLow : 
                                skill.complexity === 'medium' ? styles.complexityMed : styles.complexityHigh
                            }>{skill.complexity}</span>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* CENTER PANEL */}
         <div className={styles.centerPanel}>
            <div className={styles.promptArea}>
                <div className={styles.sectionLabel}>Natural Language Prompt (Optional)</div>
                <div className={styles.inputGroup}>
                    <input 
                        type="text" 
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder={selectedSkill ? `Execute ${selectedSkill.name}` : 'Select a skill first'}
                    />
                    <button onClick={runInference} disabled={!selectedSkill || isInferring}>
                        {isInferring ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                        Infer
                    </button>
                </div>
            </div>

            <div className={styles.resultsArea}>
                {inferenceResult ? (
                    <div>
                        <div className={styles.resultCard}>
                            <div className={styles.resultHeader}>
                                <div>
                                    <h3>{inferenceResult.skill_name}</h3>
                                    <p>{inferenceResult.prompt}</p>
                                </div>
                                <div className={styles.confidence}>
                                    <div className={styles.val}>{(inferenceResult.overall_confidence * 100).toFixed(1)}%</div>
                                    <div className={styles.label}>CONFIDENCE</div>
                                </div>
                            </div>
                            <div className={styles.statsRow}>
                                <span>{inferenceResult.action_sequence.length} steps</span>
                                <span>{inferenceResult.total_duration.toFixed(2)}s total</span>
                                <span>{inferenceResult.model_version}</span>
                            </div>
                        </div>

                        <div className={styles.sectionLabel}>Generated Action Sequence</div>
                        <ActionSequenceViewer sequence={inferenceResult.action_sequence} />

                        <button className={styles.executeButton} onClick={executeActions} disabled={isExecuting}>
                            {isExecuting ? (
                                <><Loader2 size={16} className="animate-spin" /> Executing...</>
                            ) : (
                                <><Play size={16} /> Execute on Robot</>
                            )}
                        </button>

                        {isExecuting && (
                            <div className={styles.progressBarBox}>
                                <div className={styles.fill} style={{ width: `${executionProgress}%` }} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Brain size={48} />
                        <p>Select a skill and run inference<br/>to generate action sequences</p>
                    </div>
                )}
            </div>
         </div>

         {/* RIGHT PANEL */}
         <div className={styles.rightPanel}>
            <div className={styles.sectionLabel}>Inference History</div>
            {inferenceHistory.length === 0 ? (
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', padding: '1rem' }}>No history yet</div>
            ) : (
                inferenceHistory.map((res, i) => (
                    <div key={i} className={styles.historyItem} onClick={() => setInferenceResult(res)}>
                        <div className={styles.hName}>{res.skill_name}</div>
                        <div className={styles.hMeta}>
                            <span>{res.action_sequence.length} steps</span>
                            <span style={{ color: '#a78bfa' }}>{(res.overall_confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>
    </div>
  );
}
