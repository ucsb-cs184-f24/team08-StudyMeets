import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJvn0a2JjSjbovJEKB3p7L7xdmt2F9Hug",
  authDomain: "studymeets-d8b52.firebaseapp.com",
  projectId: "studymeets-d8b52",
  storageBucket: "studymeets-d8b52.appspot.com",
  messagingSenderId: "731654649972",
  appId: "1:731654649972:web:89045c4a4e8a9452d23921",
  measurementId: "G-4KGJZLQBFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore and Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };