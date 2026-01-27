import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const goToShop = () => {
    navigate("/shop");
  };

  const handleBuy = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <h1>Shop Smart with Smart Buy</h1>
        <p>
          Find the best deals on electronics, fashion, and home essentials —
          optimized for mobile users.
        </p>
        <button onClick={goToShop}>Shop Now</button>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>

        <div className="grid">
          <article className="product-card">
            <h3>iPhone 14</h3>
            <p>₹79,999</p>
            <button
              onClick={() =>
                handleBuy({ id: 8, name: "iPhone 14", price: 79999 })
              }
            >
              Buy
            </button>
          </article>

          <article className="product-card">
            <h3>Adidas Shoes</h3>
            <p>₹3,999</p>
            <button
              onClick={() =>
                handleBuy({ id: 6, name: "Adidas Shoes", price: 3999 })
              }
            >
              Buy
            </button>
          </article>

          <article className="product-card">
            <h3>Laptop</h3>
            <p>₹40,000</p>
            <button
              onClick={() =>
                handleBuy({ id: 7, name: "Laptop", price: 40000 })
              }
            >
              Buy
            </button>
          </article>

          <article className="product-card">
            <h3>Bedsheet</h3>
            <p>₹1,500</p>
            <button
              onClick={() =>
                handleBuy({ id: 5, name: "Bedsheet", price: 1500 })
              }
            >
              Buy
            </button>
          </article>

          <article className="product-card">
            <h3>Doormat</h3>
            <p>₹1,000</p>
            <button
              onClick={() =>
                handleBuy({ id: 4, name: "Doormat", price: 1000 })
              }
            >
              Buy
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;
