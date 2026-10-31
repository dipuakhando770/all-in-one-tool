import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI provider not configured. Set AI_API_KEY environment variable." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { prompt } = body;
    // Placeholder for real provider integration (OpenAI-compatible).
    // Wire your provider here using apiKey. Never expose apiKey to the client.
    return NextResponse.json({ error: "AI provider integration not implemented yet. Configure AI_API_KEY and wire the provider in src/app/api/ai/complete/route.ts." }, { status: 501 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
