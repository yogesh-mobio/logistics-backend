const { db, firebaseSecondaryApp } = require("../../config/admin");
const { validateTransporterData } = require("./transporterHelper");

exports.newTransporter = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      address: req.body.address,
      area: req.body.area,
      city: req.body.city,
      pincode: req.body.pincode,
      state: req.body.state,
      country: req.body.country,
      registerNo: req.body.registerNo,
      gstNo: req.body.gstNo,
      // documentType: req.body.documentType,
      status: req.body.status,
    };

    const { valid, errors } = validateTransporterData(data);

    if (!valid) {
      res.render("Users/Transporter/addTransporter", {
        errors,
      });
    }

    const newTransporter = await firebaseSecondaryApp
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);

    let status = null;
    if (data.status == "true") {
      status = Boolean(!!data.status);
    } else {
      status = Boolean(!data.status);
    }

    const transporterData = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone_number: data.phone,
      user_type: "transporter",
      register_number: data.registerNo,
      gst_number: data.gstNo,
      status: status,
      created_at: new Date(),
    };

    const address = {
      flatNumber: data.address,
      area: data.area,
      city: data.city,
      pincode: data.pincode,
      state: data.state,
      country: data.country,
      // title: data.city,
    };

    await db
      .collection("users")
      .doc(newTransporter.user.uid)
      .set(transporterData);

    await db
      .collection("users")
      .doc(newTransporter.user.uid)
      .collection("address")
      .add(address);

    firebaseSecondaryApp.auth().signOut();

    // const transporter = await db.collection("users").doc();
    // await transporter.set(transporterData);

    // await db
    //   .collection("users")
    //   .doc(transporter.id)
    //   .collection("address")
    //   .add(address);

    res.render("Users/Transporter/addTransporter", {
      message: "Transporter is created...!!",
    });
  } catch (error) {
    return res.render({ error: error.code });
  }
};

exports.listTransporters = async (req, res) => {
  try {
    const transporters = [];
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (
        doc.data().user_type == "Transporter" ||
        doc.data().user_type == "transporter"
      ) {
        const transporter = { id: doc.id, transporterData: doc.data() };
        transporters.push(transporter);
      }
    });
    res.render("Users/Transporter/displayTransporter", {
      transporters: transporters,
    });
  } catch (error) {
    return res.render({ error: error.code });
  }
};

// FIELDS
// 1. reg_no 2. gst_no 3. is_register
exports.newTransporterApi = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      address: req.body.address,
      area: req.body.area,
      city: req.body.city,
      pincode: req.body.pincode,
      state: req.body.state,
      country: req.body.country,
      registerNo: req.body.registerNo,
      gstNo: req.body.gstNo,
      // documentType: req.body.documentType,
      status: req.body.status,
    };

    // const { valid, errors } = validateTransporterData(data);

    // if (!valid) {
    //   res.render("Users/Transporter/addTransporter", {
    //     errors,
    //   });
    // }

    const newTransporter = await firebaseSecondaryApp
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);

    // let status = null;
    // if (data.status == "true") {
    //   status = Boolean(!!data.status);
    // } else {
    //   status = Boolean(!data.status);
    // }

    const transporterData = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone_number: data.phone,
      user_type: "transporter",
      register_number: data.registerNo,
      gst_number: data.gstNo,
      status: data.status,
      created_at: new Date(),
    };

    const address = {
      flatNumber: data.address,
      area: data.area,
      city: data.city,
      pincode: data.pincode,
      state: data.state,
      country: data.country,
      // title: data.city,
    };

    if (newTransporter) {
      await db
        .collection("users")
        .doc(newTransporter.user.uid)
        .set(transporterData);

      await db
        .collection("users")
        .doc(newTransporter.user.uid)
        .collection("address")
        .add(address);

      res.status(201).send({
        data: { transporterData, address },
        message: "Transporter is added...!!",
      });
      firebaseSecondaryApp.auth().signOut();
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};
