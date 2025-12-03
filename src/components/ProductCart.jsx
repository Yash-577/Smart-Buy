function ProductCart({ product, addToCart, onBuy }) {
  const handleBuyClick = () => {
    if (onBuy) {
      // If onBuy is provided (from Shop page), use it to redirect to cart
      onBuy(product);
    } else {
      // Fallback for other pages that just add to cart
      addToCart(product);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleBuyClick}>Buy</button>
    </div>
  );
}
export default ProductCart;
