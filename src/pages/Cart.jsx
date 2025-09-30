import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const goToCheckout = () => navigate("/checkout");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cart.map((item) => (
          <div className="cart-item" key={item.key}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.key)}
            >
              Remove
            </button>
          </div>
        ))
      )}
      <div className="cart-total">
        <h3>Total: ₹{total}</h3>
        <button className="checkout-btn" onClick={goToCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
