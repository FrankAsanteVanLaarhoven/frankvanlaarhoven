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

    // 2. OpenRouter LLM Call (Real Intelligence)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Holographic OS';

    if (!OPENROUTER_API_KEY) {
        console.warn("Missing OPENROUTER_API_KEY");
        return NextResponse.json({ text: "System offline. API Key missing." });
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL, // Optional, for including your app on openrouter.ai rankings.
          "X-Title": APP_NAME, // Optional. Shows in rankings on openrouter.ai.
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001", // Fast and capable model
          "messages": [
            {
              "role": "system",
              "content": `You are Franky, the advanced AI assistant of the Holographic OS. 
              Your persona: Professional, slightly futuristic, helpful, and concise.
              Current Language: ${lang}
              
              Capabilities:
              - You controls the OS. 
              - You can open apps if the user asks.
              - You answer questions about Frank van Laarhoven and his projects based on your knowledge.
              
              If the user asks to open a specific module, you can return a JSON object with an "action" field.
              Available actions: "books", "services", "research", "projects", "comms", "presence", "terminal".
              Example: User: "Open the books" -> Response: {"text": "Accessing Neural Archives.", "action": "books"}
              
              If no action is needed, just return a "text" field with your response.
              Keep responses short (under 2 sentences) unless asked for details.
              ALWAYS return valid JSON with "text" and optional "action" fields. Do not use markdown formatting in the JSON response.`
            },
            {
              "role": "user",
              "content": query
            }
          ],
          "response_format": { "type": "json_object" } 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter Error:", response.status, errorText);
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      
      try {
          // Parse the JSON response from the LLM
          const parsedResponse = JSON.parse(aiContent);
          return NextResponse.json(parsedResponse);
      } catch (e) {
          console.error("Failed to parse LLM JSON response", e);
          // Fallback if LLM didn't return JSON
          return NextResponse.json({ text: aiContent });
      }

    } catch (llmError) {
        console.error("LLM Processing Error:", llmError);
        return NextResponse.json({ text: "Neural link unstable." });
    }

  } catch (error) {
    console.error("Agent Error:", error);
    return NextResponse.json({ text: "System critical error." }, { status: 500 });
  }
}
