// This context manages authentication state and user data using Firebase Auth and Firestore

import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Auth and user state
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing user from Firestore or create a new one
  const fetchOrCreateUser = async (firebaseUser) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Existing user
        setDbUser(userSnap.data());
      } else {
        // Create new user in DB
        const defaultName =
          firebaseUser.displayName || firebaseUser.email.split('@')[0];

        const newUser = {
          email: firebaseUser.email,
          displayName: defaultName,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, newUser);
        setDbUser(newUser);
      }
    } catch (error) {
      // Fallback if Firestore fails
      console.error("Firestore Error:", error);

      setDbUser({
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || firebaseUser.email.split('@')[0],
      });
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user data in background
        fetchOrCreateUser(currentUser);
      } else {
        setDbUser(null);
      }

      // Stop loading once auth state is known
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth actions
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);

  const logout = () =>
    signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        setDbUser,
        signup,
        login,
        loginWithGoogle,
        logout,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);