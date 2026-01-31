import { NextResponse } from 'next/server';
import { queryAgent } from '../../../lib/knowledge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ text: "Signal lost. Please repeat." }, { status: 400 });
    }

    // Future-proofing: Check for Real API Key
    if (process.env.OPENAI_API_KEY) {
       // TODO: Integrate OpenAI API call here for true unbounded knowledge
       // const completion = await openai.chat.completions.create({...})
       // return NextResponse.json({ text: completion.choices[0].message.content });
    }

    // Simulation Mode logic
    
    // 1. Check Local Knowledge Base
    const agentResult = queryAgent(query);
    if (agentResult) {
      return NextResponse.json({ 
        text: agentResult.response, 
        action: agentResult.action 
      });
    }

    // 2. Simulate "Internet Awareness" for common live queries
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('time') || lowerQuery.includes('date') || lowerQuery.includes('clock')) {
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return NextResponse.json({ text: `Current system time is ${now}. Global synchronization active.` });
    }

    if (lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
        return NextResponse.json({ text: "Simulating meteorological connection... Local atmosphere is stable. Temperature nominal." });
    }

    if (lowerQuery.includes('stock') || lowerQuery.includes('marked') || lowerQuery.includes('price')) {
        return NextResponse.json({ text: "Connecting to financial nodes... Tech sector showing increased volatility. Nvidia and robotics stocks are trending upwards." });
    }

    if (lowerQuery.includes('news') || lowerQuery.includes('headline')) {
        return NextResponse.json({ text: "Fetching global feeds... Top stories involve new regulations on autonomous agents and breakthroughs in humanoid robotics." });
    }

    // 3. Fallback for unknown queries
    return NextResponse.json({ 
        text: "My local database does not contain that information, and VLA Safety Protocols restrict open internet access at this time." 
    });

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json({ text: "System error. Neural pathway interrupted." }, { status: 500 });
  }
}
