// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        const roleRef = ref(database, `roles/${user.uid}`);

        // 👇 listen for role updates
        onValue(roleRef, (snapshot) => {
          const val = snapshot.val();
          console.log("📥 Role fetched from DB:", val);
          setRole(val || "user");
          setLoading(false); // ✅ only after role is fetched
        });
      } else {
        setRole(null);
        setLoading(false); // no user, stop loading
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
