// web/src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PhoneAuth from "./pages/PhoneAuth";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold">SafeConnect — Home</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome! Auth works if you signed in.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/phone" element={<PhoneAuth />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
