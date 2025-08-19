import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;
        console.log("Checkout session completed...:", JSON.stringify(session));

        if (orderId) {
            const amount = session.amount_total ? session.amount_total / 100 : undefined;
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "paid",
                total: amount,
                dateTime: new Date().toISOString(),
            }),
            });
        }else{
            return new Response(`Webhook Error: Order Id not found in the meta data`, { status: 400 });
        }
        break;
      }
      default:
        break;
    }
    return new Response("ok", { status: 200 });
  } catch (err: any) {
    return new Response(err.message ?? "Webhook handler failed", { status: 500 });
  }
}
