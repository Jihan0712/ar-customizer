import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ar-customizer.firebaseapp.com",
  projectId: "ar-customizer",
  storageBucket: "ar-customizer.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:1234567890:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);