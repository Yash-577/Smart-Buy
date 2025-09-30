import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";


import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Success from "./pages/Success"
import CheckoutButton from "./pages/CheckoutButton";
import PrivateRoute from "./components/PrivateRoute";

import AdminRoute from "./components/AdminRoute";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";



function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <SearchProvider>
    <Router>
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "20px" }}>
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout/></PrivateRoute>} />
       <Route path="/checkoutbutton" element={<CheckoutButton />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element= {<Login/>} />
        <Route path="/success" element={<Success />} />
        <Route
          path="/shop"
          element={
           
              <Shop />
           
          }
        />
        <Route
    path="/admin"
    element={
      <AdminRoute>
        <Admin />
      </AdminRoute>
    }
  />
      </Routes>
      </main>
      <Footer />
    </Router>
    </SearchProvider>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
