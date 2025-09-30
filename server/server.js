// server.js
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update } from "firebase/database";

// Firebase config
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

// Initialize Stripe
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Create a new checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart || cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const line_items = cart.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://smart-buy-ten-lovat.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://smart-buy-ten-lovat.vercel.app/cancel",

    });

    // Save order in Firebase along with sessionId
    const ordersRef = ref(database, "orders");
    await push(ordersRef, {
      items: cart.map(({ key, ...item }) => item),
      total: cart.reduce((sum, item) => sum + item.price, 0),
      date: new Date().toISOString(),
      user: "Guest", // Replace with actual user ID if available
      status: "pending",
      sessionId: session.id,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch checkout session info (for Success page verification)
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "Session ID missing" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (err) {
    console.error("Stripe session fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
