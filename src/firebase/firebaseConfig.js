// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBna3RDMy3zMsyP0RaTcyAwfT2HZG6m6kk",
  authDomain: "smart-buy1.firebaseapp.com",
  databaseURL: "https://smart-buy1-default-rtdb.firebaseio.com",
  projectId: "smart-buy1",
  storageBucket: "smart-buy1.appspot.com",
  messagingSenderId: "116647333471",
  appId: "1:116647333471:web:cb005b64aa13d53d2bd5ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export {database, auth};

