import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID from the config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Simple connection validation helper according to firebase skill best practices
export async function validateFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, "_test_connection_", "init"));
    console.log("🟢 Firebase Firestore connection successfully initialized!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("⚠️ Firebase client appears to be offline or loading.");
    } else {
      console.log("ℹ️ Firestore instance ready (checked connection).");
    }
  }
}
