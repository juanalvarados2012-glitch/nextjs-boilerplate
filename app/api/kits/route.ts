import { NextRequest, NextResponse } from "next/server";

function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  // Dynamic import so the app still works without KV configured
  return import("@vercel/kv").then(m => m.kv);
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ kits: [] });

  try {
    const kv = await getKv();
    if (!kv) return NextResponse.json({ kits: [], fallback: true });
    const kits = await kv.get<any[]>(`bm:kits:${email.toLowerCase()}`);
    return NextResponse.json({ kits: kits ?? [] });
  } catch {
    return NextResponse.json({ kits: [], fallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, kits } = await req.json();
    if (!email || !Array.isArray(kits)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const kv = await getKv();
    if (!kv) return NextResponse.json({ ok: false, fallback: true });

    // Keep max 10 kits, newest first
    const trimmed = kits.slice(0, 10);
    await kv.set(`bm:kits:${email.toLowerCase()}`, trimmed);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { email, kitId } = await req.json();
    if (!email || !kitId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const kv = await getKv();
    if (!kv) return NextResponse.json({ ok: false, fallback: true });

    const key = `bm:kits:${email.toLowerCase()}`;
    const kits = await kv.get<any[]>(key) ?? [];
    const updated = kits.filter((k: any) => k.id !== kitId);
    await kv.set(key, updated);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
