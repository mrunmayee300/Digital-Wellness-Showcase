import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, provider, onUserChange, loginWithPopup, logout as firebaseLogout } from "../../firebase.js";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onUserChange((u) => {
      console.log('Auth state changed:', u ? `User: ${u.email}` : 'No user');
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await loginWithPopup(auth, provider);
      console.log('Login successful:', result.user?.email);
      // The onAuthStateChanged listener will update the user state
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout(auth);
      console.log('Logout successful');
      // The onAuthStateChanged listener will update the user state
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Check if user email matches IIITN format
  const isValidEmail = (email) => {
    if (!email) return false;
    const pattern = /^bt2\d{7}@iiitn\.ac\.in$/i;
    return pattern.test(email);
  };

  // Memoize canUpload to ensure it updates when user changes
  const canUpload = useMemo(() => {
    return user && isValidEmail(user.email);
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loginWithGoogle,
    logout,
    loading,
    canUpload,
    isValidEmail
  }), [user, loading, canUpload]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}