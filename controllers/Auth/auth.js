const { firebase, db } = require("../../config/admin");
const {
  validateSignInData,
  validateForgetPasswordData,
  validateChangePasswordData,
} = require("./authHelper");
// const User = require("../../models/auth");

exports.signIn = async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    const { valid, errors } = validateSignInData(user);

    if (!valid) {
      return res.status(400).json(errors);
    }

    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);

    const token = await data.user.getIdToken();

    if (token) {
      res.redirect("/dashboard");
    }

    // let userEmail = null;
    // const usersData = await db.collection("users").get();
    // usersData.forEach((doc) => {
    //   if (
    //     doc.data().email == user.email &&
    //     (doc.data().user_type == "Admin" || doc.data().user_type == "admin")
    //   ) {
    //     userEmail = doc.data().email;
    //   }
    // });

    // if (user.email == userEmail) {
    //   await firebase
    //     .auth()
    //     .signInWithEmailAndPassword(user.email, user.password);

    //   res.redirect("/dashboard");
    // } else {
    //   res.redirect("/");
    // }
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

exports.forgetPassword = async (req, res) => {
  try {
    const userEmail = { email: req.body.email };

    const { valid, errors } = validateForgetPasswordData(userEmail);

    if (!valid) {
      // res.render("Pages/pages-recoverpw", { errors: errors });
      return res.status(400).json(errors);
    }

    await firebase.auth().sendPasswordResetEmail(userEmail.email);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const getCurrentUser = () => {
  try {
    let currentUser = null;
    currentUser = firebase.auth().currentUser;
    return currentUser;
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const passwords = {
      password: req.body.password,
      newPassword: req.body.newPassword,
    };

    const { valid, errors } = validateChangePasswordData(passwords);

    if (!valid) {
      res.render("Pages/change-password", {
        errors,
      });
    }

    const currentUser = getCurrentUser();
    if (currentUser != null) {
      await currentUser.updatePassword(passwords.password);
    }
    await firebase.auth().signOut();
    res.redirect("/");
  } catch (error) {
    let errors = [];
    errors.push({ msg: error.message });
    res.render("Pages/change-password", { errors: errors });
  }
};

exports.profile = async (req, res) => {
  try {
    const currentUser = getCurrentUser();

    let errors = [];
    let admin = null;

    if (currentUser != null) {
      const userUid = currentUser.uid;
      const user = await db.collection("users").doc(userUid).get();
      const userAdmin = user.data();

      let status = null;
      if (userAdmin.status === true) {
        status = "Active";
      } else {
        status = "In-active";
      }

      admin = { userAdmin, status };
      res.render("Pages/profile", { admin: admin });
    }
    errors.push({ msg: "This user is not available..!!" });
    res.render("Pages/pages-error", { errors });
  } catch (error) {
    let errors = [];
    errors.push({ msg: error.code });
    res.render("Pages/pages-error", { errors });
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
//   const vehicle = (doc.id, doc.data().vehicle_type);
//   vehicles.push(vehicle);
// });
// return vehicles;

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     return user;
//   }
// });
