// web/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Helper to create reCAPTCHA verifier for phone auth.
 * Use in a component (only on client-side).
 */
export function createRecaptchaVerifier(containerId = "recaptcha-container") {
  // firebase-auth will attach an invisible reCAPTCHA by default, but explicit is clearer.
  return new RecaptchaVerifier(containerId, { size: "invisible" }, auth);
}

export default app;
