const { db, firebase } = require("../../config/admin");
// const { validateDriverData } = require("./driverHelper");

// Get Driver's list of a perticular Transporter
exports.transporterDriversList = async (req, res) => {
  try {
    const drivers = [];
    const id = req.params.transporter_id;

    const data = await db.collection("users").doc(id);
    const getDrivers = await data.collection("driver_details").get();

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
    return res.render("Users/Driver/transporterDrivers", {
      drivers: drivers,
    });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Users/Transporter/displayTransporter", {
      errors: errors,
    });
  }
};

// Get driver details
exports.driverDetails = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.driver_id;

    const user = await db.collection("users").doc(id);
    const driverData = await user.get();
    const data = await driverData.data();

    if (data === undefined) {
      errors.push({ msg: "Driver not found...!!" });
      return res.render("Errors/errors", {
        errors: errors,
      });

      // req.flash("error_msg", "Driver not found...!!");
      // res.redirect(window.history.back());
      // res.redirect(`/driver/${data.transporter_uid}/drivers`);
      // res.redirect(`/transporter/displayTransporters`);
      // res.redirect(location.history.back());
      // return res.render("Users/Transporter/transporterDrivers", {
      // return res.send(errors);
    }

    const driver = { id: data.id, driverData: data };

    return res.render("Users/Driver/driverDetails", {
      driver: driver,
    });
  } catch (error) {
    console.log(error);
    const errors = [];
    errors.push({ msg: error });
    return res.render("Errors/errors", {
      errors: errors,
    });
  }
};

// Change Driver Status API
exports.changeDriverStatus = async (req, res) => {
  const errors = [];
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  try {
    // console.log("HELLO YOU ARE IN CHANGE STATUS API OF DRIVER");
    // console.log("DATA", req.body.reason);
    // console.log("Driver_id", driver_id);
    // console.log("Transporter_id", transporter_id);

    const user = await db.collection("users").doc(driver_id);
    const data = await user.get();
    const driverData = await data.data();

    if (driverData === undefined) {
      errors.push({ msg: "Driver not found...!!" });
      res.render("Errors/errors", { errors: errors });
    }

    const Status = {
      status: !driverData.status,
    };
    // console.log("Status", Status);

    const updateData = {
      type: "users",
      id: await db.doc("users/" + driver_id),
      user_id: await firebase.auth().currentUser.uid,
      updated_at: new Date(),
      status: Status.status,
      reason: req.body.reason,
    };

    // console.log("UPDATED DATA", updateData);
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

    await user.update(Status);

    const transporter = await db.collection("users").doc(transporter_id);
    const getDrivers = await transporter.collection("driver_details").get();

    let id = null;
    getDrivers.forEach((doc) => {
      if (driver_id == doc.data().user_uid) {
        id = doc.id;
      }
    });
    const getDriverId = await transporter.collection("driver_details").doc(id);
    await getDriverId.update(Status);

    await db.collection("status_logs").add(updateData);

    res.redirect("back");
    // return true;
    // return res.redirect(`driver/${transporter_id}/displayDrivers`);
  } catch (error) {
    console.log(error);
  }
};

// Delete Driver API
exports.removeDriver = async (req, res) => {
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  const errors = [];

  try {
    // const transporter_id = req.params.transporter_id;
    // const driver_id = req.params.driver_id;
    // console.log("HELLO YOU ARE IN DELETE API OF TRANSPORTER");
    // console.log("DATA", data);
    // console.log("ID", id);

    const user = await db.collection("users").doc(driver_id);
    const data = await user.get();
    const driverData = await data.data();

    if (driverData === undefined) {
      errors.push({ msg: "Driver not found...!!" });
      res.render("Errors/errors", { errors: errors });
    }

    const updateData = {
      reason: req.body.reason,
      is_deleted: true,
      status: false,
    };

    const deletedData = {
      type: "users",
      id: await db.doc("users/" + driver_id),
      user_id: await firebase.auth().currentUser.uid,
      deleted_at: new Date(),
    };
    /** Change the IDs whenevern required */
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
    await user.update(updateData);

    const transporter = await db.collection("users").doc(transporter_id);
    const getDrivers = await transporter.collection("driver_details").get();

    let id = null;
    getDrivers.forEach((doc) => {
      if (driver_id == doc.data().user_uid) {
        id = doc.id;
      }
    });
    const getDriverId = await transporter.collection("driver_details").doc(id);
    await getDriverId.update(updateData);

    await db.collection("deletion_logs").add(deletedData);

    res.redirect("back");
  } catch (error) {
    const errors = [];
    console.log(error);
    errors.push({ msg: error.message });
    return res.render("Errors/errors", {
      errors: errors,
    });
  }
};

// Vrify Driver API
exports.verifyDriver = async (req, res) => {
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  const errors = [];

  try {
    // console.log("HELLO YOU ARE IN Verify API OF Driver");
    // console.log("TID", transporter_id);
    // console.log("DID", driver_id);

    const user = await db.collection("users").doc(driver_id);
    const data = await user.get();
    const driverData = await data.data();

    if (driverData === undefined) {
      errors.push({ msg: "Driver not found...!!" });
      res.render("Errors/errors", { errors: errors });
    } else {
      let updateData = {};
      if (driverData.is_verified === "pending") {
        updateData = {
          is_verified: "verified",
        };
      }

      await user.update(updateData);

      const transporter = await db.collection("users").doc(transporter_id);
      const getDrivers = await transporter.collection("driver_details").get();

      let id = null;
      getDrivers.forEach((doc) => {
        if (driver_id == doc.data().user_uid) {
          id = doc.id;
        }
      });
      const getDriverId = await transporter
        .collection("driver_details")
        .doc(id);
      await getDriverId.update(updateData);

      res.redirect("back");
    }
  } catch (error) {
    const errors = [];
    console.log(error);
    errors.push({ msg: error.message });
    return res.render("Errors/errors", {
      errors: errors,
    });
  }
};

/*
  Add New Driver
*/
// exports.newDriver = async (req, res) => {
//   try {
//     // Getting transporter's ID from url
//     const transpoterId = req.params.transporter_id;

//     // Getting driver's data from the UI
//     const data = {
//       email: req.body.email,
//       firstname: req.body.firstname,
//       lastname: req.body.lastname,
//       phone: req.body.phone,
//       address: req.body.address,
//       area: req.body.area,
//       city: req.body.city,
//       pincode: req.body.pincode,
//       state: req.body.state,
//       country: req.body.country,
//       documentType: req.body.documentType,
//       status: req.body.status,
//     };

//     // Checking Validations errors
//     const { valid, errors } = validateDriverData(data);

//     if (!valid) {
//       return res.status(400).json(errors);
//     }

//     // Converting status type from String to  Boolean
//     let status = null;
//     if (data.status == "true") {
//       status = Boolean(!!data.status);
//     } else {
//       status = Boolean(!data.status);
//     }

//     // Setting driver's data into objects
//     const driverData = {
//       first_name: data.firstname,
//       last_name: data.lastname,
//       email: data.email,
//       phone_number: data.phone,
//       user_type: "Driver",
//       status: status,
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

//     // Storing Driver's data into firestore
//     const transpoter = await db.collection("users").doc(transpoterId);
//     const driver = await transpoter.collection("driver_details").doc();

//     await driver.set(driverData);
//     await driver.collection("address").doc().set(address);
//     await driver
//       .collection("documents")
//       .doc()
//       .set({ type: data.documentType, url: "", updated_at: new Date() });

//     // Rendering add Driver's UI
//     res.render("Users/Driver/addDriver", {
//       message: "Driver is created...!!",
//     });
//   } catch (error) {
//     // Rendering Errors
//     return res.render({ error: error.code });
//   }
// };
