// web/src/pages/SignIn.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const { signInEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErr("");
      await signInEmail(email, pass);
      nav("/");
    } catch (error: any) {
      setErr(error.message || "Sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded border mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full p-2 rounded border mb-3"
          required
        />
        <button className="w-full py-2 bg-blue-600 text-white rounded">Sign in</button>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/phone" className="text-blue-600">Sign in with phone</Link>
          <Link to="/signup" className="text-gray-600">Create account</Link>
        </div>
      </form>
    </div>
  );
}
