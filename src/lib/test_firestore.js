const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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
const db = getFirestore(app);

async function testWrite() {
  console.log("Attempting to write diagnostic document to Firestore...");
  try {
    const docRef = await addDoc(collection(db, "diagnostics"), {
      timestamp: new Date().toISOString(),
      message: "Testing connection from local platform to Firestore"
    });
    console.log("✅ Success! Document written with ID:", docRef.id);
  } catch (error) {
    console.error("❌ Firestore Write Failed! Error details:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Full Error:", error);
  }
  process.exit(0);
}

testWrite();
