// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { currentUser, role, loading } = useContext(AuthContext);

  console.log("🔐 AdminRoute check:", { currentUser, role, loading });

  if (loading) return <p>Loading...</p>;

  if (!currentUser) {
    console.warn("⛔ No user logged in → redirecting to /login");
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    console.warn(`⛔ Role is '${role}' → redirecting to /`);
    return <Navigate to="/" />;
  }

  console.log("✅ Admin access granted!");
  return children;
}

export default AdminRoute;
