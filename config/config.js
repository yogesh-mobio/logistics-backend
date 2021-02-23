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
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// firebase.analytics();

module.exports = firebaseConfig;
