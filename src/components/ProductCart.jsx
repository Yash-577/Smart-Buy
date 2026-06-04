import { useState } from "react";
import VirtualTryOn from "./VirtualTryOn";

function ProductCart({ product, addToCart, onBuy }) {
  const [showTryOn, setShowTryOn] = useState(false);

  const handleBuyClick = () => {
    if (onBuy) {
      onBuy(product);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleBuyClick}>Buy</button>
      <button
        onClick={() => setShowTryOn(true)}
        style={{
          marginTop: "8px",
          width: "100%",
          padding: "10px",
          background: "transparent",
          border: "2px solid #6c63ff",
          color: "#6c63ff",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        👗 Virtual Try-On
      </button>

      {showTryOn && (
        <VirtualTryOn
          productImageUrl={product.image}
          productName={product.name}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </div>
  );
}

export default ProductCart;
