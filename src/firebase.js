import firebase from "firebase/app";
require("firebase/firestore")

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDoAH6BF3tSo6fyWNdAD9F2oCT_UvF9L_I",
    authDomain: "game-generator-f5731.firebaseapp.com",
    databaseURL: "https://game-generator-f5731-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "game-generator-f5731",
    storageBucket: "game-generator-f5731.appspot.com",
    messagingSenderId: "898729762353",
    appId: "1:898729762353:web:fce358ab7f02b125d5bf10",
    measurementId: "G-02Z2HDYCEZ"
  };

firebase.initializeApp(firebaseConfig);

export default firebase