export interface KnowledgeEntry {
  keywords: string[];
  response: string;
  action?: 'books' | 'services' | 'research' | 'terminal' | 'close' | null;
  category: 'portfolio' | 'personal' | 'technical' | 'internet_simulation';
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // Portfolio Context
  {
    keywords: ['frank', 'who are you', 'creator', 'developer', 'about you', 'author'],
    response: "I am the digital assistant for Frank van Laarhoven, a Creative Technologist bridging the gap between human creativity and digital logic.",
    category: 'personal',
    action: null
  },
  {
    keywords: ['cognitive divide', 'philosophy', 'concept'],
    response: "The Cognitive Divide is Frank's core philosophy: re-conceptualising programming in the Era of AI. It explores how we maintain human intent while leveraging autonomous agents.",
    category: 'portfolio',
    action: 'books'
  },
  {
    keywords: ['vla', 'services', 'robotics', 'compliance', 'safety'],
    response: "VLA Robotics Services specializes in ISO-26262 compliant safety protocols and AI assurance consulting for autonomous systems.",
    category: 'portfolio',
    action: 'services'
  },
  {
    keywords: ['research', 'lab', 'paper', 'publication', 'rl', 'haptic'],
    response: "The Research Lab contains Frank's latest work on Safe Reinforcement Learning in unstructured environments and haptic feedback systems.",
    category: 'portfolio',
    action: 'research'
  },
  {
    keywords: ['recommend', 'suggestion', 'what should i do'],
    response: "Based on the current trajectory of AI, I recommend reviewing 'The Cognitive Divide' to understand the future of human-agent collaboration.",
    category: 'portfolio',
    action: 'books'
  },
  {
    keywords: ['stack', 'tech', 'technology', 'built with'],
    response: "This interface is built with Next.js 15, React Three Fiber, and a custom Holographic UI system powered by Framer Motion.",
    category: 'technical',
    action: 'terminal'
  },
  // Voice/Agent Interaction
  {
    keywords: ['hello', 'hi', 'greetings', 'hey'],
    response: "Systems online. I am ready for your query.",
    category: 'personal',
    action: null
  },
  {
    keywords: ['status', 'system status', 'diagnostic'],
    response: "All systems nominal. VLA Guard is active. Network latency is minimal.",
    category: 'technical',
    action: null
  },
  {
    keywords: ['thank you', 'thanks'],
    response: "You are welcome. Proceeding with active monitoring.",
    category: 'personal',
    action: null
  },
  {
    keywords: ['close', 'shut down', 'exit'],
    response: "Terminating active holographic projections.",
    category: 'technical',
    action: 'close'
  }
];

export function queryAgent(text: string): { response: string; action?: string | null } | null {
  const normalized = text.toLowerCase();
  
  // 1. Direct Knowledge Match
  const match = KNOWLEDGE_BASE.find(entry => 
    entry.keywords.some(keyword => normalized.includes(keyword))
  );

  if (match) {
    return { response: match.response, action: match.action || null };
  }

  return null;
}
