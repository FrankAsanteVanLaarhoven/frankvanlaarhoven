import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const DID_API_KEY = process.env.DID_API_KEY || process.env.NEXT_PUBLIC_DID_API_KEY;

  if (!DID_API_KEY) {
    console.error("Missing D-ID API Key in Server Env");
    return NextResponse.json({ error: "Missing D-ID API Key (check .env)" }, { status: 500 });
  }

  // Basic Auth Encoding
  let authHeader = DID_API_KEY.startsWith('Basic ') ? DID_API_KEY : `Basic ${DID_API_KEY}`;
  if (DID_API_KEY.includes(':') && !DID_API_KEY.startsWith('Basic ')) {
    authHeader = `Basic ${btoa(DID_API_KEY)}`;
  }

  try {
    // 1. Try to create a client key
    const createResp = await fetch("https://api.d-id.com/agents/client-key", {
        method: "POST",
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            allowed_domains: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000']
        })
    });

    if (createResp.ok) {
        const data = await createResp.json();
        return NextResponse.json(data);
    }

    // 2. If 400 (Already Exists), try to retrieve existing key
    if (createResp.status === 400) {
        console.log("D-ID Client Key exists, retrieving existing key...");
        
        const getResp = await fetch("https://api.d-id.com/agents/client-key", {
            method: "GET",
            headers: { "Authorization": authHeader }
        });

        if (getResp.ok) {
            const data = await getResp.json();
            return NextResponse.json(data);
        } else {
             const errorText = await getResp.text();
             return NextResponse.json({ error: `Failed to retrieve existing key: ${getResp.statusText} - ${errorText}` }, { status: getResp.status });
        }
    }

    // Handle other errors
    const errorText = await createResp.text();
    return NextResponse.json({ error: `D-ID Error: ${createResp.statusText} - ${errorText}` }, { status: createResp.status });

  } catch (error: any) {
    console.error("D-ID Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
