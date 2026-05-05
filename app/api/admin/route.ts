import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers: { email: string; date: string; amount: string; currency: string }[] = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  while (hasMore) {
    const sessions: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const s of sessions.data) {
      if (s.payment_status === "paid" && s.customer_email) {
        customers.push({
          email: s.customer_email,
          date: new Date(s.created * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          amount: ((s.amount_total ?? 0) / 100).toFixed(2),
          currency: (s.currency ?? "usd").toUpperCase(),
        });
      }
    }

    hasMore = sessions.has_more;
    if (hasMore && sessions.data.length > 0) {
      startingAfter = sessions.data[sessions.data.length - 1].id;
    }
  }

  customers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ customers, total: customers.length });
}
