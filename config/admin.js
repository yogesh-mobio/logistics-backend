const firebase = require("firebase");
const firebaseAdmin = require("firebase-admin");
require("dotenv").config();

const firebaseConfig = require("./config");

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.applicationDefault(),
//   databaseURL: process.env.DATABASE_URL,
// });

firebaseAdmin.initializeApp();
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = { db, firebase, firebaseAdmin };
