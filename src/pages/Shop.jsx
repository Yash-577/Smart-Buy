import { useState, useEffect, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

import ProductCart from "../components/ProductCart";
import { CartContext } from "../context/CartContext";
import CheckoutButton from "./CheckoutButton";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useContext(CartContext); // Ensure CartContext provides `cart`

  useEffect(() => {
    const productsRef = ref(database, "Products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.values(data) : []);
    });
  }, []);

  return (
    <div>
      <h2>Shop Products</h2>
      <div className="grid">
        {products.map((p) => (
          <ProductCart key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <CheckoutButton cart={cart} />
        </div>
      )}
    </div>
  );
}

export default Shop;
