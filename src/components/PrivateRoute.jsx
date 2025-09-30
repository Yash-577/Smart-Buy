import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser, role, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // wait until auth/role is loaded

  if (!currentUser) return <Navigate to="/login" />; // redirect if not logged in

  if (adminOnly && role !== "admin") return <Navigate to="/" />; // redirect if not admin

  return children;
}

export default PrivateRoute;
