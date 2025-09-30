import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth); // 👈 checks if user is logged in

  return (
    <nav className="navbar">
      <div className="logo">My Shop</div>
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
      <ul className={isOpen ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link>
        </li>
        <li>
          <Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link>
        </li>
        <li>
          <Link to="/checkout" onClick={() => setIsOpen(false)}>Checkout</Link>
        </li>
        

        {/* 👇 Authentication Links */}
        {user ? (
          <li>
            <button className="log-out" onClick={() => signOut(auth)}>Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
