// web/src/pages/PhoneAuth.tsx
import React, { useState } from "react";
import { createRecaptchaVerifier } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { RecaptchaVerifier } from "firebase/auth";

export default function PhoneAuth() {
  const { signInWithPhone } = useAuth();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmResult, setConfirmResult] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const startPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMsg("");
      // create reCAPTCHA and request SMS
      const verifier: RecaptchaVerifier = createRecaptchaVerifier("recaptcha-container");
      const result = await signInWithPhone(phone, verifier);
      setConfirmResult(result);
      setMsg("SMS sent. Enter the code.");
    } catch (err: any) {
      setMsg(err.message || "Phone auth failed");
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!confirmResult) throw new Error("No confirmation result");
      await confirmResult.confirm(code); // signs in the user
      setMsg("Phone signed in");
    } catch (err: any) {
      setMsg(err.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Phone sign-in</h3>
        {msg && <div className="text-sm text-rose-600 mb-2">{msg}</div>}
        {!confirmResult ? (
          <form onSubmit={startPhone}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91**********"
              className="w-full p-2 rounded border mb-3"
              required
            />
            <div id="recaptcha-container" />
            <button className="w-full py-2 bg-blue-600 text-white rounded">Send code</button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full p-2 rounded border mb-3"
              required
            />
            <button className="w-full py-2 bg-green-600 text-white rounded">Verify</button>
          </form>
        )}
      </div>
    </div>
  );
}

