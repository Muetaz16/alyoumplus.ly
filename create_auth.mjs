import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDU07TRRL6Kdvbm4A-hjvMtNDaENWpTqUQ",
  authDomain: "alyoum-plus.firebaseapp.com",
  projectId: "alyoum-plus",
  storageBucket: "alyoum-plus.firebasestorage.app",
  messagingSenderId: "664378779774",
  appId: "1:664378779774:web:0c75e0df57afb20d7c502f",
  measurementId: "G-69F9QZ6KVT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "motaz@gmail.com", "motaz123");
    console.log("User created:", userCredential.user.uid);
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
  process.exit();
}

createUser();
