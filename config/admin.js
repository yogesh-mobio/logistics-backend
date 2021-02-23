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
  .bucket("logistics - ondemand - app.appspot.com");
let messaging = firebaseAdmin.messaging();

var payload = {
  notification: {
    title: "This is a Notification",
    body: "This is the body of the notification message.",
  },
};

var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

// const token = [
//   "ctZ1yuQwSzmIhwQmRGkNUW:APA91bGWTsoxG5JdOM_wLYJ7TkjqZtEaGbUYY_flX1dvMUsJjTYflafRj1OvWN9N19N5zB7lZp70_tbcDwlHenLJPJpCixYU-HN0ibTu5mXYRNFAow7dt48YFVxIc7rdWy1oMNKnugBE",
// ];

// messaging
//   .sendToDevice(token, payload, options)
//   // .sendToDevice(payload, options)
//   .then(function (response) {
//     console.log("Have Permission******", response);
//     // console.log(response.results[0].error);
//   })
//   .catch(function (err) {
//     console.log("Error occured");
//   });

module.exports = {
  db,
  firebase,
  firebaseAdmin,
  firebaseSecondaryApp,
  bucket,
  messaging,
};
