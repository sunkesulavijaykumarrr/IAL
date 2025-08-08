// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add your own Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyDBcNRMDokhFQ4BgU9QhviT3YIoyXKDW-c",
  authDomain: "ial-d730a.firebaseapp.com",
  projectId: "ial-d730a",
  storageBucket: "ial-d730a.appspot.com",
  messagingSenderId: "870079267013",
  appId: "1:870079267013:web:b1515667acedbc8b1bf0ac",
  measurementId: "G-YSB54PG8CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
