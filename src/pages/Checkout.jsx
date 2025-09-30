import { useContext, useState } from "react"; 
import { CartContext } from "../context/CartContext";
import { ref, push } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SC2yCRs5wVBbQiVq9DMoDFiopYRuWw1fUCFtxgFUAT7JldcmZfMJ8U8R6j7X9txUFpsgwt49qhS4CZD0vp5mstp00f8AlowWm");

function Checkout() {
  const { cart, removeFromCart } = useContext(CartContext);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setProcessing(true);

    try {
      const stripe = await stripePromise;

   const response = await fetch("/api/create-checkout-session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ cart }),
});


      const session = await response.json();

      if (!session.id) {
        alert("Checkout session not created.");
        console.error("Full backend response:", session);
        setProcessing(false);
        return;
      }

      // Save order in Firebase BEFORE redirecting
      const ordersRef = ref(database, "orders");
      await push(ordersRef, {
        items: cart.map(({ key, ...item }) => item),
        total,
        date: new Date().toISOString(),
        user: "Guest",
        status: "pending",
        sessionId: session.id,
      });

      // Redirect to Stripe Hosted Checkout
      await stripe.redirectToCheckout({ sessionId: session.id });

    } catch (error) {
      console.error("Payment request failed:", error);
      alert("Something went wrong while processing payment.");
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="checkout-items">
            {cart.map(item => (
              <div className="checkout-item" key={item.key}>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button onClick={() => removeFromCart(item.key)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <h3>Total: ₹{total}</h3>
            <button onClick={handlePayment} disabled={processing}>
              {processing ? "Processing..." : "Pay with Stripe"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
