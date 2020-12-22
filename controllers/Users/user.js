const { db, firebaseAdmin, firebase } = require("../../config/admin");
const { validateUserData } = require("./userHelper");

exports.newUser = async (req, res) => {
  try {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      documentType: req.body.documentType,
      status: req.body.status,
    };

    const { valid, errors } = validateUserData(userData);

    if (!valid) {
      return res.status(400).json(errors);
    }

    const newUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(userData.email, userData.password);

    const token = newUser.user.getIdToken();
    console.log(token);

    let status = null;
    if (userData.status == "true") {
      status = Boolean(!!userData.status);
    } else {
      status = Boolean(!userData.status);
    }

    const data = {
      first_name: userData.firstname,
      last_name: userData.lastname,
      email: userData.email,
      phone_number: userData.phone,
      user_type: "admin",
      photo: "",
      status: status,
      createdAt: new Date(),
    };

    await db.collection("users").doc(newUser.user.uid).set(data);
    await db
      .collection("users")
      .doc(newUser.user.uid)
      .collection("documents")
      .add({ type: userData.documentType, url: "", updatedAt: new Date() });

    res.render("User/addAdmin", { message: "Admin is created...!!" });
  } catch (error) {
    if (error.code == "auth/email-already-in-use") {
      return res.status(400).json({ email: "Email already exist!" });
    }
    return res.render({ error: error.code });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = [];
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (doc.data().user_type == "admin") {
        const user = { id: doc.id, userData: doc.data() };
        users.push(user);
      }
    });
    res.render("User/displayUsers", { users: users });
  } catch (error) {
    console.log(error);
  }
};

exports.removeUser = async (req, res) => {
  try {
    const uid = req.params.id;

    const batch = db.batch();
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("documents")
      .get();

    data.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    await db.collection("users").doc(uid).delete();

    await firebaseAdmin.auth().deleteUser(uid);
    console.log("USER IS DELETED");
    res.redirect("/displayUsers");
  } catch (error) {
    res.status(400).json({ error: error.code });
  }
};
