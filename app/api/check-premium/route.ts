import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ premium: false });
    }

    const sessions = await stripe.checkout.sessions.list({
      customer_email: email.toLowerCase().trim(),
      limit: 10,
    });

    const hasPaid = sessions.data.some((s) => s.payment_status === "paid");
    return NextResponse.json({ premium: hasPaid });
  } catch {
    return NextResponse.json({ premium: false });
  }
}
