import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQInUNZwjQQeY04CcUX-hxizaZzV0IXpU",
  authDomain: "cs184-hw02-21734.firebaseapp.com",
  projectId: "cs184-hw02-21734",
  storageBucket: "cs184-hw02-21734.appspot.com",
  messagingSenderId: "1017360029963",
  appId: "1:1017360029963:web:404043a5b22f9a07462a0e",
};

export const app = initializeApp(firebaseConfig);
export const f_auth = getAuth(app);