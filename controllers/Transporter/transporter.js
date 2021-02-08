var NodeGeocoder = require("node-geocoder");
require("dotenv").config();

const { db, firebaseSecondaryApp, firebase } = require("../../config/admin");
const { validateTransporterData } = require("./transporterHelper");

const getLatLong = async (address) => {
  var geocoder = NodeGeocoder({
    provider: process.env.GEO_PROVIDER,
    apiKey: process.env.GEO_API_KEY,
  });

  // const res = await geocoder.geocode("Rajasthan 302029");
  // const res = await geocoder.geocode("andheri east mumbai 400069");
  const res = await geocoder.geocode(address);

  let max = 0;
  let latitude = null;
  let longitude = null;
  let coordinates = {};

  if (res.length > 1) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].extra.confidence > max) {
        max = res[i].extra.confidence;
        latitude = res[i].latitude;
        longitude = res[i].longitude;
      }
    }
    coordinates = {
      latitude: latitude,
      longitude: longitude,
    };
  } else {
    coordinates = {
      latitude: res[0].latitude,
      longitude: res[0].longitude,
    };
  }
  return coordinates;
};

const isBoolean = async (string) => {
  let boolean = null;
  if (string == "true") {
    boolean = Boolean(!!string);
  } else {
    boolean = Boolean(!string);
  }
  return boolean;
};

exports.newTransporter = async (req, res) => {
  try {
    const data = req.body;
    // console.log("***************", data);
    // Add document type whenever its required. It is not added yet.

    const { valid, errors } = validateTransporterData(data);

    if (!valid) {
      return res.render("Users/Transporter/addTransporter", {
        errors,
      });
    } else {
      const address = {
        area: data.area,
        city: data.city,
        pincode: data.pincode,
      };
      const stringAddress = JSON.stringify(Object.values(address));
      const latLong = await getLatLong(stringAddress);

      let status = await isBoolean(data.status);
      let registered = await isBoolean(data.registered);

      const newTransporter = await firebaseSecondaryApp
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      const transporterData = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        phone_number: data.phone,
        user_type: "transporter",
        register_number: data.registerNo,
        gst_number: data.gstNo,
        status: status,
        registered: registered,
        is_deleted: false,
        reason: "",
        created_at: new Date(),
        address: {
          coordinates: latLong,
          flatNumber: data.address,
          area: data.area,
          city: data.city,
          pincode: data.pincode,
          state: data.state,
          country: data.country,
          // title: data.city,
        },
      };

      // console.log("***************", transporterData);

      await db
        .collection("users")
        .doc(newTransporter.user.uid)
        .set(transporterData);

      // const address = {
      //   flatNumber: data.address,
      //   area: data.area,
      //   city: data.city,
      //   pincode: data.pincode,
      //   state: data.state,
      //   country: data.country,
      //   // title: data.city,
      // };

      // await db
      //   .collection("users")
      //   .doc(newTransporter.user.uid)
      //   .collection("address")
      //   .add(address);

      firebaseSecondaryApp.auth().signOut();

      // const transporter = await db.collection("users").doc();
      // await transporter.set(transporterData);

      // await db
      //   .collection("users")
      //   .doc(transporter.id)
      //   .collection("address")
      //   .add(address);
      return res.render("Users/Transporter/addTransporter", {
        message: "Transporter is created...!!",
      });
    }

    // return res.redirect("/transporter/createTransporter");
  } catch (error) {
    const errors = [];
    if (error.code == "auth/email-already-in-use") {
      errors.push({ msg: "Email already exists!" });
      return res.render("Users/Transporter/addTransporter", {
        errors,
      });
    }
    errors.push({ msg: error.message });
    return res.render("Users/Transporter/addTransporter", {
      errors,
    });
  }
};

exports.listTransporters = async (req, res) => {
  try {
    const transporters = [];
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (
        (doc.data().user_type == "Transporter" ||
          doc.data().user_type == "transporter") &&
        doc.data().is_deleted === false
      ) {
        const transporter = { id: doc.id, transporterData: doc.data() };
        transporters.push(transporter);
      }
    });
    return res.render("Users/Transporter/displayTransporter", {
      transporters: transporters,
    });
  } catch (error) {
    return res.render({ error: error.code });
  }
};

exports.changeTransporterStatus = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.transporter_id;
    const transporterData = await db.collection("users").doc(id);
    const getTransporterData = await transporterData.get();
    const data = await getTransporterData.data();

    if (!transporterData) {
      errors.push({ msg: "There is no data available" });
      return res.render("User/Transporter/Transporters", { errors: errors });
    }

    const updateStatus = {
      status: !data.status,
      reason: req.body.reason,
    };

    await transporterData.update(updateStatus);
    return res.redirect("/transporter/displayTransporters");
  } catch (error) {
    console.log(error);
  }
};

// Delete transporter API
exports.removeTransporter = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.transporter_id;
    // console.log("HELLO YOU ARE IN DELETE API OF TRANSPORTER");
    // console.log("DATA", data);
    // console.log("ID", id);

    const transporterData = await db.collection("users").doc(id);

    const updateData = {
      reason: req.body.reason,
      is_deleted: true,
      status: false,
    };

    if (!transporterData) {
      errors.push({ msg: "There are no data available" });
      return res.render("User/Transporter/displayTransporter", {
        errors: errors,
      });
    }

    const deletedData = {
      type: "users",
      id: await db.doc("users/" + id),
      user_id: await firebase.auth().currentUser.uid,
      deleted_at: new Date(),
    };
    // await firebase.auth().updateUser(id, { disabled: true });
    // await firebaseAdmin
    //   .auth()
    //   .updateUser(id, { disabled: true })
    //   .then((userRecord) => {
    //     // See the UserRecord reference doc for the contents of userRecord.
    //     console.log("Successfully updated user", userRecord.toJSON());
    //   })
    //   .catch((error) => {
    //     console.log("Error updating user:", error);
    //   });
    await transporterData.update(updateData);

    await db.collection("deletion_logs").add(deletedData);

    return res.redirect("/transporter/displayTransporters");
  } catch (error) {
    console.log(error);
  }
};

exports.transporterDetails = async (req, res) => {
  try {
    const id = req.params.transporter_id;

    const data = await db.collection("users").doc(id).get();
    if (data.data() == undefined) {
      req.flash("error_msg", "Transporter not found...!!");
      return res.redirect("/transporter/displayTransporters");
    } else {
      let transporter = { id: data.id, transporterData: data.data() };
      return res.render("Users/Transporter/transporterDetails", {
        transporter: transporter,
      });
    }
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/transporter/displayTransporters");
  }
};

// exports.transporterDriversList = async (req, res) => {
//   try {
//     const errors = [];
//     const drivers = [];
//     const id = req.params.transporter_id;

//     const data = await db.collection("users").doc(id);
//     const getDrivers = await data.collection("driver_details").get();

//     if (!data) {
//       errors.push({ msg: "There is no data available" });
//       return res.render("User/Transporter/displayTransporter", {
//         errors: errors,
//       });
//     }

//     getDrivers.forEach(async (doc) => {
//       const driver = {
//         id: doc.id,
//         driverData: doc.data(),
//         transporter_id: id,
//       };
//       drivers.push(driver);
//     });
//     // return res.render("Users/Transporter/transporterDrivers", {
//     return res.render("Users/Driver/transporterDrivers", {
//       drivers: drivers,
//     });
//   } catch (error) {
//     console.log(error);
//     const errors = [];
//     errors.push({ msg: error.message });
//     return res.render("Users/Transporter/displayTransporter", {
//       errors: errors,
//     });
//   }
// };

// exports.transporterVehiclesList = async (req, res) => {
//   try {
//     const errors = [];
//     const vehicles = [];
//     const id = req.params.transporter_id;

//     const data = await db.collection("users").doc(id);
//     const getVehicles = await data.collection("vehicle_details").get();

//     if (!data) {
//       errors.push({ msg: "There is no data available" });
//       return res.render("User/Transporter/displayTransporter", {
//         errors: errors,
//       });
//     }

//     getVehicles.forEach(async (doc) => {
//       const vehicle = {
//         id: doc.id,
//         vehicleData: doc.data(),
//         transporter_id: id,
//       };
//       vehicles.push(vehicle);
//     });
//     return res.render("Users/Transporter/transporterVehicles", {
//       vehicles: vehicles,
//     });
//   } catch (error) {
//     console.log(error);
//     const errors = [];
//     errors.push({ msg: error.message });
//     return res.render("Users/Transporter/displayTransporter", {
//       errors: errors,
//     });
//   }
// };

// FIELDS
// 1. reg_no 2. gst_no 3. is_register

/*
  Add transporter NEW API
*/

// exports.newTransporterApi = async (req, res) => {
//   try {
//     const data = {
//       email: req.body.email,
//       password: req.body.password,
//       firstname: req.body.firstname,
//       lastname: req.body.lastname,
//       phone: req.body.phone,
//       address: req.body.address,
//       area: req.body.area,
//       city: req.body.city,
//       pincode: req.body.pincode,
//       state: req.body.state,
//       country: req.body.country,
//       registerNo: req.body.registerNo,
//       gstNo: req.body.gstNo,
//       // documentType: req.body.documentType,
//       status: req.body.status,
//     };

//     // const { valid, errors } = validateTransporterData(data);

//     // if (!valid) {
//     //   return res.render("Users/Transporter/addTransporter", {
//     //     errors,
//     //   });
//     // }

//     const newTransporter = await firebaseSecondaryApp
//       .auth()
//       .createUserWithEmailAndPassword(data.email, data.password);

//     // let status = null;
//     // if (data.status == "true") {
//     //   status = Boolean(!!data.status);
//     // } else {
//     //   status = Boolean(!data.status);
//     // }

//     const transporterData = {
//       first_name: data.firstname,
//       last_name: data.lastname,
//       email: data.email,
//       phone_number: data.phone,
//       user_type: "transporter",
//       register_number: data.registerNo,
//       gst_number: data.gstNo,
//       status: data.status,
//       created_at: new Date(),
//     };

//     const address = {
//       flatNumber: data.address,
//       area: data.area,
//       city: data.city,
//       pincode: data.pincode,
//       state: data.state,
//       country: data.country,
//       // title: data.city,
//     };

//     if (newTransporter) {
//       await db
//         .collection("users")
//         .doc(newTransporter.user.uid)
//         .set(transporterData);

//       await db
//         .collection("users")
//         .doc(newTransporter.user.uid)
//         .collection("address")
//         .add(address);

//       firebaseSecondaryApp.auth().signOut();
//       return res.status(201).send({
//         data: { transporterData, address },
//         message: "Transporter is added...!!",
//       });
//     }
//   } catch (error) {
//     return res.status(400).send({ error: error.message });
//   }
// };
