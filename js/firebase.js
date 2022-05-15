import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNofoZNnXGBFMBLuqnZFuRdXo5hoHpPK8",
  authDomain: "smidgen-5f8b9.firebaseapp.com",
  databaseURL: "https://smidgen-5f8b9-default-rtdb.firebaseio.com",
  projectId: "smidgen-5f8b9",
  storageBucket: "smidgen-5f8b9.appspot.com",
  messagingSenderId: "818424523798",
  appId: "1:818424523798:web:633db26a153e5d682f5937",
  measurementId: "G-XT3XKCDV5C"
};

console.log("Firebase Config Export: ",typeof firebaseConfig,firebaseConfig)

const defaultApp = initializeApp(firebaseConfig);
const db = getFirestore(defaultApp);

export default {db, defaultApp, firebaseConfig};


