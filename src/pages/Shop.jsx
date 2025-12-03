import { useState, useEffect, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import ProductCart from "../components/ProductCart";
import { CartContext } from "../context/CartContext";
import CheckoutButton from "./CheckoutButton";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const productsRef = ref(database, "Products");
    
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        
        // Convert Firebase object to array
        const productsArray = data
          ? Object.entries(data).map(([key, product]) => ({
              firebaseKey: key, // Keep the Firebase key for operations
              ...product,
            }))
          : [];
        
        console.log("📦 Products loaded:", productsArray);
        setProducts(productsArray);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="shop-container"><p>Loading products...</p></div>;
  }

  return (
    <div className="shop-container">
      <h2>Shop Products</h2>
      
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCart
              key={p.firebaseKey || p.id}
              product={p}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <CheckoutButton cart={cart} />
        </div>
      )}
    </div>
  );
}

export default Shop;
