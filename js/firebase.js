import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyArMNa72SMprOFmoz6Gp3KWZD8bhvPtJCI",
  authDomain: "cali-nails.firebaseapp.com",
  projectId: "cali-nails",
  storageBucket: "cali-nails.firebasestorage.app",
  messagingSenderId: "215924205312",
  appId: "1:215924205312:web:44e8fcc775c14107a3b5e5"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };