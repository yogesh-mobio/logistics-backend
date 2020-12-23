const { firebase } = require("../../config/admin");
const { validateSignInData } = require("./authHelper");
// const User = require("../../models/auth");

exports.signIn = async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    const { valid, errors } = await validateSignInData(user);

    if (!valid) {
      return res.status(400).json(errors);
    }

    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);

    const token = await data.user.getIdToken();

    if (token) {
      res.redirect("/dashboard");
      // console.log(token);
      // return res.status(201).json({ token });
    }
  } catch (error) {
    if (error.code == "auth/invalid-email") {
      return res.status(403).json("Please enter the valid email ID");
    }
    if (
      error.code == "auth/wrong-password" ||
      error.code == "auth/user-not-found"
    ) {
      return res
        .status(403)
        .json({ message: "Wrong credentials, Please try again" });
    }
    return res.status(500).json({ error: error.code });
  }
};

exports.signOut = async (req, res) => {
  try {
    await firebase.auth().signOut();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
//   const data = await db.collection("users").get();
//   let authData;

// data.docs.map((doc) => {
//   users.push(doc.data());
//   res.redirect("/dashboard");
// });

//   data.forEach((doc) => {
//     if (doc.data().email == email) {
//       const user = new User(
//         doc.id,
//         doc.data().email,
//         doc.data().password,
//         doc.data().user_type
//       );
//       authData = user;
// if (authData.email == email && authData.password == password) {
//   console.log("Hello");
// }
//       req.session.authUser = authData;
//     }
//   });

//   console.log("USER", authData);
// const vehicles = [];
// const data = await db.collection("vehicles").get();
// data.forEach((doc) => {
//   const vehicle = (doc.id, doc.data().vehicle_name);
//   vehicles.push(vehicle);
// });
// return vehicles;
