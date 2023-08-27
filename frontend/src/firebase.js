// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByWH5i0aPpKAlwJC5-pN_F_OSRoYrSZfI",
  authDomain: "mern-chat-app-e164b.firebaseapp.com",
  projectId: "mern-chat-app-e164b",
  storageBucket: "mern-chat-app-e164b.appspot.com",
  messagingSenderId: "560639246273",
  appId: "1:560639246273:web:372888a08b131c9b523940",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
