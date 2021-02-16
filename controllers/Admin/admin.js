const { db, firebaseSecondaryApp, firebase } = require("../../config/admin");
const { validateAdminData } = require("./adminHelper");

exports.newAdmin = async (req, res) => {
  try {
    const adminData = {
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      documentType: req.body.documentType,
      status: req.body.status,
    };

    const { valid, errors } = validateAdminData(adminData);

    if (!valid) {
      res.render("Users/Admin/addAdmin", {
        errors,
      });
    } else {
      const newAdmin = await firebaseSecondaryApp
        .auth()
        .createUserWithEmailAndPassword(adminData.email, adminData.password);

      let status = null;
      if (adminData.status == "true") {
        status = Boolean(!!adminData.status);
      } else {
        status = Boolean(!adminData.status);
      }

      const data = {
        first_name: adminData.firstname,
        last_name: adminData.lastname,
        email: adminData.email,
        phone_number: adminData.phone,
        user_type: "Admin",
        photo: "",
        status: status,
        created_at: new Date(),
      };

      await db.collection("users").doc(newAdmin.user.uid).set(data);
      await db
        .collection("users")
        .doc(newAdmin.user.uid)
        .collection("documents")
        .add({ type: adminData.documentType, url: "", updated_at: new Date() });

      firebaseSecondaryApp.auth().signOut();

      res.render("Users/Admin/addAdmin", {
        message: "Admin is created...!!",
      });
    }
  } catch (error) {
    const errors = [];
    if (error.code == "auth/email-already-in-use") {
      errors.push({ msg: "Email already exists!" });
      res.render("Users/Admin/addAdmin", {
        errors,
      });
    }
    errors.push({ msg: error.message });
    return res.render("Users/Admin/addAdmin", { errors });
  }
};

exports.listAdmins = async (req, res) => {
  try {
    const admins = [];
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (
        (doc.data().user_type == "Admin" || doc.data().user_type == "admin") &&
        doc.data().is_deleted === false
      ) {
        const admin = { id: doc.id, adminData: doc.data() };
        admins.push(admin);
      }
    });
    res.render("Users/Admin/displayAdmins", { admins: admins });
  } catch (error) {
    return res.render({ error: error.code });
  }
};

exports.removeAdmin = async (req, res) => {
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

    // await firebase.auth().deleteUser(uid);
    // console.log("USER IS DELETED");
    res.redirect("/admin/displayAdmins");
  } catch (error) {
    res.status(400).json({ error: error.code });
  }
};
