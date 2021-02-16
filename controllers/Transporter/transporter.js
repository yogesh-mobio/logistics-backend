var NodeGeocoder = require("node-geocoder");
require("dotenv").config();

const {
  db,
  firebaseSecondaryApp,
  firebase,
  bucket,
} = require("../../config/admin");
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

exports.getNewTransporter = async (req, res) => {
  const vehicleTypes = [];
  const data = await db.collection("vehicles").get();
  data.forEach((doc) => {
    // const vehicleType = { id: doc.id, vehicleTypeData: doc.data() };
    vehicleTypes.push(doc.data().vehicle_type);
  });
  try {
    return res.render("Users/Transporter/addTransporter", {
      vehicleTypes: vehicleTypes,
    });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    // return res.render("Errors/errors", { errors: errors });
    return res.render("Users/Transporter/addTransporter", {
      errors: errors,
      vehicleTypes: vehicleTypes,
    });
  }
};

exports.newTransporter = async (req, res) => {
  const vehicleTypes = [];
  const data = await db.collection("vehicles").get();
  data.forEach((doc) => {
    // const vehicleType = { id: doc.id, vehicleTypeData: doc.data() };
    vehicleTypes.push(doc.data().vehicle_type);
  });
  try {
    const data = req.body;
    // console.log("***************", data);

    /*
    Files related work START
     */
    // const file = req.files;
    // const file = req.files;
    // const file = req.files.profile[0];
    // const filename = req.files.profile[0].originalname;
    // console.log(
    //   "***************",
    //   data,
    //   "*********",
    //   file
    // "************",
    // filename
    // );

    // let blob = await bucket.file(file.originalname);
    // const blobWriter = blob.createWriteStream({
    //   metadata: {
    //     contentType: file.mimetype,
    //   },
    // });

    // blobWriter.on("finish", async () => {
    //   let url = await blob.getSignedUrl({
    //     action: "read",
    //     expires: "01-01-2500",
    //   });
    //   const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
    //     bucket.name
    //   }/o/${encodeURI(blob.name)}?alt=media`;
    //   console.log("%%%%%%%%%%%%", publicUrl);
    //   console.log("%%%%%%%%%%%%", url);
    // });
    // blobWriter.end(file.buffer);

    // let url = await blob.publicUrl();
    // let token = await ref.to;
    // let url = await ref.getSignedUrl({ action: "read", expires: "01-01-2500" });
    // let storageRef = await firebase.storage.ref(filename);
    // let putFile = await storageRef.child(filename).put(file);
    // putFile.then((call) => {
    //   let url = call.ref.getDownloadURL();
    //   console.log("%%%%%%%%%%%%%%", url);
    // });
    // let url = await storageRef.getDownloadURL();
    // let ref1 = await bucket.upload(file.originalname, {
    //   contentType: file.mimetype,
    // });
    // console.log("%%%%%%%%%%%%%%", url);
    /*
      Files related work END
    */

    // Add document type whenever its required. It is not added yet.

    const { valid, errors } = validateTransporterData(data);

    if (!valid) {
      return res.render("Users/Transporter/addTransporter", {
        vehicleTypes: vehicleTypes,
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

      let transporterData = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        phone_number: data.phone,
        user_type: "transporter",
        register_number: data.registerNo,
        is_verified: "pending",
        gst_number: data.gstNo,
        status: status,
        registered: registered,
        is_deleted: false,
        reason: "",
        created_at: new Date(),
        priority: 0,
        is_request: false,
        driver_count: 1,
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

      let driverData = {
        first_name: data.FirstName,
        last_name: data.LastName,
        email: data.Email,
        phone_number: data.Phone,
        // user_type: "transporter",
        age: data.Age,
        // address_proof: data.AddressProof,
        address_proof: "",
        // identity_proof: data.IdentityProof,
        identity_proof: "",
        created_at: new Date(),
        // driver_photo: data.profile,
        driver_photo: "",
        is_assign: false,
        is_deleted: false,
        is_verified: "pending",
        status: false,
        // user_uid: newTransporter.user.uid,
      };

      const vehicleData = {
        vehicle_type: data.vehicleTypeName,
        vehicle_number: data.VehicleNumber,
        comment: data.Comments,
        chassis_number: data.ChassisNumber,
        vehicle_photos: [],
        created_at: new Date(),
        is_assign: false,
        is_deleted: false,
        is_verified: "pending",
        status: false,
      };

      const newTransporter = await firebaseSecondaryApp
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      let transporter = await db
        .collection("users")
        .doc(newTransporter.user.uid);
      await transporter.set(transporterData);

      const vehicle = await transporter.collection("vehicle_details").doc();
      await vehicle.set(vehicleData);

      let transporterDriverData = {};
      let newDriverData = {};

      if (data.TransporterAsDriver === "checked") {
        transporterDriverData = {
          ...driverData,
          user_uid: newTransporter.user.uid,
        };

        const transporterDriver = await transporter
          .collection("driver_details")
          .doc();
        await transporterDriver.set(transporterDriverData);
      } else {
        let driverPassword = Math.random().toString(36).slice(-8);

        const newDriver = await firebaseSecondaryApp
          .auth()
          .createUserWithEmailAndPassword(data.Email, driverPassword);

        transporterDriverData = {
          ...driverData,
          temp_password: driverPassword,
          user_uid: newDriver.user.uid,
        };

        newDriverData = {
          ...driverData,
          temp_password: driverPassword,
          transporter_uid: newTransporter.user.uid,
          user_type: "driver",
        };

        let driver = await db.collection("users").doc(newDriver.user.uid);
        await driver.set(newDriverData);

        const transporterDriver = await transporter
          .collection("driver_details")
          .doc();
        await transporterDriver.set(transporterDriverData);
        firebaseSecondaryApp.auth().signOut();
      }

      firebaseSecondaryApp.auth().signOut();

      return res.render("Users/Transporter/addTransporter", {
        message: "Transporter is created...!!",
        vehicleTypes: vehicleTypes,
      });

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

      // const transporter = await db.collection("users").doc();
      // await transporter.set(transporterData);

      // await db
      //   .collection("users")
      //   .doc(transporter.id)
      //   .collection("address")
      //   .add(address);
    }
    // return res.redirect("/transporter/createTransporter");
  } catch (error) {
    const errors = [];
    if (error.code == "auth/email-already-in-use") {
      errors.push({ msg: "Email already exists!" });
      return res.render("Users/Transporter/addTransporter", {
        vehicleTypes: vehicleTypes,
        errors,
      });
    }
    errors.push({ msg: error.message });
    return res.render("Users/Transporter/addTransporter", {
      vehicleTypes: vehicleTypes,
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
    const errors = [];
    errors.push(error.message);
    return res.render("Users/Transporter/displayTransporter", {
      errors: errors,
    });
  }
};

exports.changeTransporterStatus = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.transporter_id;
    const transporterData = await db.collection("users").doc(id);
    const getTransporterData = await transporterData.get();
    const data = await getTransporterData.data();

    if (!data) {
      errors.push({ msg: "There is no data available" });
      return res.render("Users/Transporter/displayTransporter", {
        errors: errors,
      });
    }

    const Status = {
      status: !data.status,
    };

    const updateData = {
      reason: req.body.reason,
      type: "users",
      id: await db.doc("users/" + id),
      user_id: await firebase.auth().currentUser.uid,
      updated_at: new Date(),
      status: Status.status,
    };

    await transporterData.update(Status);
    await db.collection("status_logs").add(updateData);

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

    const getTransporterById = await db.collection("users").doc(id);
    const data = await getTransporterById.get();
    if (data.data() == undefined) {
      req.flash("error_msg", "Transporter not found...!!");
      return res.redirect("/transporter/displayTransporters");
    } else {
      const drivers = [];
      const vehicles = [];

      let getDrivers = await getTransporterById
        .collection("driver_details")
        .get();

      getDrivers.forEach(async (doc) => {
        if (doc.data().is_deleted === false) {
          const driver = {
            id: doc.id,
            driverData: doc.data(),
            transporter_id: id,
          };
          drivers.push(driver);
        }
      });

      let getVehicles = await getTransporterById
        .collection("vehicle_details")
        .get();

      getVehicles.forEach(async (doc) => {
        if (doc.data().is_deleted === false) {
          const vehicle = {
            id: doc.id,
            vehicleData: doc.data(),
            transporter_id: id,
          };
          vehicles.push(vehicle);
        }
      });

      let transporter = { id: data.id, transporterData: data.data() };
      return res.render("Users/Transporter/transporterDetails", {
        transporter: transporter,
        drivers: drivers,
        vehicles: vehicles,
      });
    }
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/transporter/displayTransporters");
  }
};

exports.verifyTransporter = async (req, res) => {
  try {
    const id = req.params.transporter_id;

    const getTransporterById = await db.collection("users").doc(id);
    const data = await getTransporterById.get();
    if (data.data() == undefined) {
      req.flash("error_msg", "Transporter not found...!!");
      return res.redirect("/transporter/displayTransporters");
    }
    {
      const drivers = [];
      const vehicles = [];

      let getDrivers = await getTransporterById
        .collection("driver_details")
        .get();

      getDrivers.forEach(async (doc) => {
        if (doc.data().is_deleted === false) {
          const driver = {
            id: doc.id,
            driverData: doc.data(),
            transporter_id: id,
          };
          drivers.push(driver);
        }
      });

      let getVehicles = await getTransporterById
        .collection("vehicle_details")
        .get();

      getVehicles.forEach(async (doc) => {
        if (doc.data().is_deleted === false) {
          const vehicle = {
            id: doc.id,
            vehicleData: doc.data(),
            transporter_id: id,
          };
          vehicles.push(vehicle);
        }
      });

      let transporter = { id: data.id, transporterData: data.data() };
      return res.render("Users/Transporter/verifyTransporter", {
        transporter: transporter,
        drivers: drivers,
        vehicles: vehicles,
      });
    }
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/transporter/displayTransporters");
  }
};

exports.verifiedTransporter = async (req, res) => {
  try {
    const id = req.params.transporter_id;

    const data = req.body;

    const getTransporterById = await db.collection("users").doc(id);
    const transporter = await getTransporterById.get();
    const transporterData = await transporter.data();

    const drivers = [];
    const vehicles = [];

    if (data.verifyDriver === "checked") {
      let getTransporterDrivers = await getTransporterById.collection(
        "driver_details"
      );
      let getDrivers = await getTransporterDrivers.get();

      getDrivers.forEach(async (doc) => {
        if (doc.data().is_deleted === false) {
          const driver = {
            id: doc.id,
            driverData: doc.data(),
            transporter_id: id,
          };
          drivers.push(driver);
        }
      });

      const transporterDriver = await drivers[0].id;
      const transporterDriverData = await getTransporterDrivers.doc(
        transporterDriver
      );

      if (
        drivers.length === 1 &&
        drivers[0].driverData.email !== transporterData.email
      ) {
        const driverUID = drivers[0].driverData.user_uid;

        await transporterDriverData.update({ is_verified: "verified" });

        const driverUser = await db.collection("users").doc(driverUID);
        await driverUser.update({ is_verified: "verified" });
      } else {
        await transporterDriverData.update({ is_verified: "verified" });
        // req.flash("error_msg", "There are multile drivers to verify..!!");
        // res.redirect("/transporter/displayTransporters");
      }
      await getTransporterById.update({ is_request: true });
    }

    if (data.verifyVehicle === "checked") {
      let getTransporterVehicles = await getTransporterById.collection(
        "vehicle_details"
      );
      let getVehicles = await getTransporterVehicles.get();

      getVehicles.forEach(async (doc) => {
        if (doc.data().is_deleted === false) {
          const vehicle = {
            id: doc.id,
            vehicleData: doc.data(),
            transporter_id: id,
          };
          vehicles.push(vehicle);
        }
      });

      const transporterVehicle = await vehicles[0].id;
      const transporterVehicleData = await getTransporterVehicles.doc(
        transporterVehicle
      );

      if (vehicles.length === 1) {
        await transporterVehicleData.update({ is_verified: "verified" });
      } else {
        req.flash("error_msg", "There are multile Vehicles to verify..!!");
        res.redirect("/transporter/displayTransporters");
      }
    }

    await getTransporterById.update({ is_verified: "verified" });
    return res.redirect("/transporter/displayTransporters");
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/transporter/displayTransporters");
  }
};

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
