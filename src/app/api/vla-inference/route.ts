import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skill, prompt } = body;

    if (!skill) {
      return NextResponse.json({ error: "No skill provided." }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const APP_NAME = 'Gr00t VLA Interface';

    if (!OPENROUTER_API_KEY) {
      console.warn("Missing OPENROUTER_API_KEY");
      // Fallback to mock if key is missing, or return error? 
      // User requested "full functionalities", so error is better to prompt config.
      return NextResponse.json({ error: "OpenRouter API Key missing in environment." }, { status: 503 });
    }

    // Construct the prompt for the VLA model
    const systemPrompt = `You are NVIDIA Gr00t, a sophisticated Vision-Language-Action (VLA) model for humanoid robot control.
    
    Your task: Generate a realistic robotic action sequence based on the user's requested skill and prompt.
    
    Input Context:
    - Skill: ${skill.name} (${skill.category})
    - User Prompt: ${prompt || "Execute defaults"}
    
    Output Requirements:
    - You must return ONLY raw JSON.
    - The JSON must match this exact schema:
    {
      "action_sequence": [
        {
          "step": number (1-indexed),
          "joints": {
             "left_shoulder": float (-3.14 to 3.14),
             "left_elbow": float,
             "left_wrist": float,
             "right_shoulder": float,
             "right_elbow": float,
             "right_wrist": float,
             "hip": float,
             "left_knee": float,
             "right_knee": float
          },
          "duration": float (0.5 to 2.0 seconds),
          "confidence": float (0.0 to 1.0)
        }
      ],
      "total_duration": float,
      "overall_confidence": float,
      "model_version": "gr00t-vla-2.0-live",
      "timestamp": string (ISO date)
    }
    
    - Generate between 3 to 8 steps for the sequence.
    - Ensure joint angles are varied realistic values for the movement.
    - Return NO markdown formatting, just the raw JSON object.
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": APP_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": `Generate action sequence for ${skill.name}` }
          ],
          "response_format": { "type": "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      
      const parsed = JSON.parse(aiContent);
      // Ensure timestamp is set if model forgot it
      if (!parsed.timestamp) parsed.timestamp = new Date().toISOString();
      // Ensure other metadata
      if (!parsed.skill_id) parsed.skill_id = skill.id;
      if (!parsed.skill_name) parsed.skill_name = skill.name;
      if (!parsed.prompt) parsed.prompt = prompt;

      return NextResponse.json(parsed);

    } catch (llmError) {
      console.error("VLA Inference Error:", llmError);
      return NextResponse.json({ error: "VLA Inference failed." }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 500 });
  }
}
