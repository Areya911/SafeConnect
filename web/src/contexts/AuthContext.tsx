// web/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  // Note: we DO NOT import User or RecaptchaVerifier as runtime imports
} from "firebase/auth";
import { auth } from "../firebase";

// TYPE-ONLY imports (erased at compile time)
import type { User } from "firebase/auth";
import type { RecaptchaVerifier } from "firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInWithPhone: (phone: string, appVerifier: RecaptchaVerifier) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUpEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const signInWithPhone = async (phone: string, appVerifier: RecaptchaVerifier) => {
    return await signInWithPhoneNumber(auth, phone, appVerifier);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signUpEmail, signInEmail, signOutUser, signInWithPhone }}
    >
      {children}
    </AuthContext.Provider>
  );
};
