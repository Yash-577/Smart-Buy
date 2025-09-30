// CartContext.jsx
import { createContext, useState, useEffect } from "react";
import { ref, push, onValue, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartRef = ref(database, "cart/global");
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCart(data ? Object.entries(data).map(([key, val]) => ({ key, ...val })) : []);
    });
  }, []);

  const addToCart = (item) => {
    const cartRef = ref(database, "cart/global");
    push(cartRef, item);
  };

  const removeFromCart = (key) => {
    remove(ref(database, `cart/global/${key}`));
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};
