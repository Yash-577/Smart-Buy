// api/create-checkout-session.js
import Stripe from "stripe";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBna3RDMy3zMsyP0RaTcyAwfT2HZG6m6kk",
  authDomain: "smart-buy1.firebaseapp.com",
  databaseURL: "https://smart-buy1-default-rtdb.firebaseio.com",
  projectId: "smart-buy1",
  storageBucket: "smart-buy1.appspot.com",
  messagingSenderId: "116647333471",
  appId: "1:116647333471:web:cb005b64aa13d53d2bd5ea"
};

const appFirebase = initializeApp(firebaseConfig);
const database = getDatabase(appFirebase);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Vercel Serverless handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart } = req.body;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = cart.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Use req.headers.origin for dynamic absolute URLs
    const origin = req.headers.origin || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    // Save order in Firebase
    const ordersRef = ref(database, "orders");
    await push(ordersRef, {
      items: cart.map(({ key, ...item }) => item),
      total: cart.reduce((sum, item) => sum + item.price, 0),
      date: new Date().toISOString(),
      user: "Guest",
      status: "pending",
      sessionId: session.id,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}
