const firebase = require("firebase");
require("dotenv").config();

const {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: "AIzaSyDWcZSbyp_kYJSNxLRVVemkx_5V9JlQDHA",
  authDomain: "logistics-ondemand-app.firebaseapp.com",
  databaseURL: "https://logistics-ondemand-app.firebaseio.com",
  projectId: "logistics-ondemand-app",
  storageBucket: "logistics-ondemand-app.appspot.com",
  messagingSenderId: "335686843365",
  appId: "1:335686843365:web:d4bb2a7c82af72fcdf8d0c",
  measurementId: "G-7WPCXTQJ8N",
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// firebase.analytics();

module.exports = firebaseConfig;
