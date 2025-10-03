import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCox8MPURXlh5jhvD-u2Jd9ZGvEHueNdJk",
  authDomain: "ar-customizer-b809a.firebaseapp.com",
  projectId: "ar-customizer-b809a",
  storageBucket: "ar-customizer-b809a.firebasestorage.app",
  messagingSenderId: "469529011241",
  appId: "1:469529011241:web:fb58d41b356f6d3cede838",
  measurementId: "G-WQLTZKJP7R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

