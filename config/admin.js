const firebase = require("firebase");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
require("dotenv").config();

const firebaseConfig = require("./config");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  // credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: process.env.DATABASE_URL,
});

// firebaseAdmin.initializeApp();
firebase.initializeApp(firebaseConfig);
const firebaseSecondaryApp = firebase.initializeApp(
  firebaseConfig,
  "Secondary"
);

const db = firebase.firestore();
// let bucket = firebaseAdmin.storage().bucket(process.env.STORAGE_BUCKET);
let bucket = firebaseAdmin
  .storage()
  .bucket("logistics-ondemand-app.appspot.com");
let messaging = firebaseAdmin.messaging();

module.exports = {
  db,
  firebase,
  firebaseAdmin,
  firebaseSecondaryApp,
  bucket,
  messaging,
};
