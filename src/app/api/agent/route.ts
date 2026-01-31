import { NextResponse } from 'next/server';
import { queryAgent, SupportedLang } from '../../../lib/knowledge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, lang = 'en' } = body;

    if (!query) {
      return NextResponse.json({ text: "Signal lost." }, { status: 400 });
    }

    // 1. Check Knowledge Base (Multilingual)
    // Cast lang to SupportedLang (safe fallback in queryAgent if invalid)
    const agentResult = queryAgent(query, lang as SupportedLang);
    if (agentResult) {
      return NextResponse.json({ 
        text: agentResult.response, 
        action: agentResult.action 
      });
    }

    // 2. Simulate "Internet Awareness" (Currently EN only for simulation logic cleanliness)
    // We could add localization here too
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('time') || lowerQuery.includes('zeit') || lowerQuery.includes('tijd') || lowerQuery.includes('hora')) {
        const now = new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        return NextResponse.json({ text: `System time: ${now}` });
    }
    
    // ... (Keep other simulations simple for now)

    // 3. Fallback
    const fallbacks: Record<string, string> = {
        en: "I do not recognize that command.",
        de: "Ich erkenne diesen Befehl nicht.",
        nl: "Ik herken dat commando niet.",
        es: "No reconozco ese comando.",
        pt: "Não reconheço esse comando.",
        zh: "我不认识那个命令。",
        ar: "لا أتعرف على هذا الأمر."
    };

    return NextResponse.json({ 
        text: fallbacks[lang] || fallbacks['en']
    });

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json({ text: "System error." }, { status: 500 });
  }
}
