import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const firestore = getFirestore(app);

async function seedUser() {
  try {
    const payload = {
      id: 99,
      email: "motaz@gmail.com",
      password: "motaz123",
      name: "رئيس التحرير",
      role: "ADMIN"
    };
    const docRef = doc(firestore, "adminUsers", "99");
    await setDoc(docRef, payload);
    console.log("User added to Firestore adminUsers collection.");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
  process.exit();
}

seedUser();
