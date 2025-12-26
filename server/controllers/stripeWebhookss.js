import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {
  console.log("🔥 WEBHOOK ROUTE HIT");

  console.log("🧾 Headers stripe-signature:", request.headers["stripe-signature"]);
  console.log("🧾 Body type:", typeof request.body);
  console.log("🧾 Body is Buffer:", Buffer.isBuffer(request.body));

  const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook signature verified");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📣 Event type received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("📦 Full session object:", session);
    console.log("📦 Session metadata:", session.metadata);

    const bookingId = session.metadata?.bookingId;
    console.log("🆔 bookingId from metadata:", bookingId);

    if (!bookingId) {
      console.error("❌ bookingId missing in metadata");
      return response.status(400).json({ error: "bookingId missing" });
    }

    try {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe",
      });
      console.log("✅ Booking marked as PAID in database");
    } catch (dbError) {
      console.error("❌ Database update failed:", dbError.message);
      return response.status(500).json({ error: "DB update failed" });
    }
  }

  response.json({ received: true });
};
