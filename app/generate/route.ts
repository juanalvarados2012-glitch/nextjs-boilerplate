import { NextRequest, NextResponse } from "next/server";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-70b-8192";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}