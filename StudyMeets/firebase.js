import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhBHIYHrXl_PCxnmb2KL3yVtVnSDfv6FA",
  authDomain: "cs184-homework2.firebaseapp.com",
  projectId: "cs184-homework2",
  storageBucket: "cs184-homework2.appspot.com",
  messagingSenderId: "987596908129",
  appId: "1:987596908129:web:6811f7801e00ccbd94ec20",
  measurementId: "G-D2W26WXGP0"
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
