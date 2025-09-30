import { useState, useEffect } from "react";
import { ref, onValue, push, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig"; // adjust path if needed
import "./Admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, "Products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.entries(data) : []);
    });
  }, []);

  // Add new product
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Please fill all fields");
      return;
    }
    const productsRef = ref(database, "Products");
    push(productsRef, {
      id: Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      image: newProduct.image || "https://via.placeholder.com/150",
    });
    setNewProduct({ name: "", price: "", image: "" });
  };

  // Delete product
  const deleteProduct = (key) => {
    const productRef = ref(database, `Products/${key}`);
    remove(productRef);
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      {/* Add Product Form */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Products List */}
      <div className="admin-products">
        {products.map(([key, product]) => (
          <div className="admin-product-card" key={key}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button onClick={() => deleteProduct(key)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
