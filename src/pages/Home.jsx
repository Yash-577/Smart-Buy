import { useNavigate } from "react-router-dom";
import { useContext } from "react";          // ✅ import useContext
import { CartContext } from "../context/CartContext";  // ✅ import CartContext

import "./Home.css"

function Home() {
  const navigate = useNavigate(); // get the navigate function
   const { addToCart } = useContext(CartContext); 

  const goToShop = () => {
    navigate("/shop"); // navigate to Shop page
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero">
        <h1>Welcome to MyShop 🛒</h1>
        <p>Best deals on electronics, fashion, and more!</p>
        <button onClick={goToShop}>Shop Now</button>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>
        <div className="grid">
          <div className="product-card">
            <h3>iPhone 14</h3>
            <p>₹79,999</p>
            <button onClick={() => addToCart({id:8, name: "iPhone", price: 79999})}>
              Buy
            </button>
          </div>
          <div className="product-card">
            <h3>Adidas Shoes</h3>
            <p>₹3,999</p>
            <button onClick={() => addToCart({id:6, name: "Adidas Shoes", price: 3999})}>
              Buy
            </button>
          </div>
          <div className="product-card">
            <h3>Laptop</h3>
            <p>₹40,000</p>
            <button onClick={() => addToCart({id:7, name: "Laptop", price: 40000})}>
              Buy
            </button>
          </div>
          <div className="product-card">
            <h3>Bedsheet</h3>
            <p>₹1500</p>
            <button onClick={() => addToCart({id:5, name: "Bedsheet", price: 1500})}>
              Buy
            </button>
          </div>
            <div className="product-card">
            <h3>Doormat</h3>
            <p>₹1000</p>
            <button onClick={() => addToCart({ id: 4, name: "Doormat", price: 1000 })}>
            Buy
            </button>
            
            
            
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default Home;
