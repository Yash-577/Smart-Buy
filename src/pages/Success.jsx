import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, update, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import "./Success.css";

function Success() {
  const [status, setStatus] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const markOrderPaid = async () => {
      try {
        const ordersRef = ref(database, "orders");
        const snapshot = await get(ordersRef);

        if (!snapshot.exists()) {
          setStatus("No orders found.");
          return;
        }

        let updated = false;

        snapshot.forEach(child => {
          const order = child.val();
          // Only update the most recent pending order
          if (!updated && order.status === "pending") {
            update(ref(database, `orders/${child.key}`), { status: "paid" });
            updated = true;
          }
        });

        if (updated) {
          setStatus("Payment successful! Thank you for your order.");
        } else {
          setStatus("No pending orders to update.");
        }
      } catch (err) {
        console.error("Error updating order status:", err);
        setStatus("Error verifying payment.");
      }
    };

    markOrderPaid();
  }, []);

  return (
    <div className="success-container">
      <h2>{status}</h2>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
}

export default Success;
