import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Use your Stripe Publishable Key here
const stripePromise = loadStripe("pk_test_51SC2yCRs5wVBbQiVq9DMoDFiopYRuWw1fUCFtxgFUAT7JldcmZfMJ8U8R6j7X9txUFpsgwt49qhS4CZD0vp5mstp00f8AlowWm");
const CheckoutButton = ({ cart }) => {
  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        console.error("No session ID returned:", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  
};

export default CheckoutButton;
