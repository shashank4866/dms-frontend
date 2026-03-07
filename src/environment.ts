// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAhSc0EZl-Ah1Af_YErhOx_0hFdBs1BXOI",
  authDomain: "fcm-demo-b8977.firebaseapp.com",
  projectId: "fcm-demo-b8977",
  storageBucket: "fcm-demo-b8977.firebasestorage.app",
  messagingSenderId: "546938487296",
  appId: "1:546938487296:web:0b7cb06338df8929f28ee5",
  measurementId: "G-KMWC2XN6ES"
};
export const environment = {
  firebase: firebaseConfig
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


