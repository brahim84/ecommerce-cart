import Stripe from "stripe";

export const runtime = "nodejs"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil", 
});

type CartItem = {
  id: string;
  title: string;
  price: number;     
  image?: string;
  amount: number;
};

export async function POST(req: Request) {
  try {
    const { items, customer_email, orderId } = await req.json() as { items: CartItem[]; customer_email?: string, orderId?: string };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response("Cart is empty", { status: 400 });
    }
    // if (!customer_email) {
    //   return new Response("Customer email is required", { status: 400 });
    // }
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((p) => ({
      quantity: p.amount,
      price_data: {
        currency: "nzd",
        unit_amount: Math.round(p.price * 100), // cents
        product_data: {
          name: p.title,
          images: p.image
            ? [p.image.startsWith("http") ? p.image : `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_UPLOADS_URL}/${p.image}`]
            : [],
          //metadata: { order_id: String(orderId || "") },
        },
      },
    }));

    // console.log("line_items.json.:",JSON.stringify(line_items));
    // return new Response("debugging..", { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email,
      //shipping_address_collection: { allowed_countries: ["NZ", "AU"] },
      allow_promotion_codes: false,
      automatic_tax: { enabled: false },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: { order_id: String(orderId) },
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return new Response(err.message ?? "Something went wrong", { status: 500 });
  }
}
