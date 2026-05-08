import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function sendWelcomeEmail(email: string) {
  if (!process.env.RESEND_API_KEY) return;
  const { buildWelcomeEmail } = await import("../lib/welcomeEmail");
  const { subject, html } = buildWelcomeEmail(email);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "BrandMind <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;
    if (email) {
      console.log("✅ Payment completed:", email);
      await sendWelcomeEmail(email).catch(e => console.warn("Email failed:", e));
    }
  }

  return NextResponse.json({ received: true });
}