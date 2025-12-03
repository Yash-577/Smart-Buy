// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebaseConfig";
import { ref, get } from "firebase/database";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const roleRef = ref(database, `roles/${user.uid}`);
          const snapshot = await get(roleRef); // Use get() instead of onValue()
          const val = snapshot.val();
          console.log("📥 Role fetched from DB:", val);
          setRole(val || "user");
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole("user"); // Default to user if error
        }
      } else {
        setRole(null);
      }
      
      setLoading(false); // ✅ Always set to false after checking role
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
