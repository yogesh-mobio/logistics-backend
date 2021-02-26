const { db, firebase, messaging } = require("../../config/admin");
const { sendAdminNotification } = require("../Notification/notification");
// const { validateDriverData } = require("./driverHelper");

// Get Driver's list of a perticular Transporter
// exports.transporterDriversList = async (req, res) => {
//   try {
//     const drivers = [];
//     const id = req.params.transporter_id;

//     const data = await db.collection("users").doc(id);
//     const getDrivers = await data.collection("driver_details").get();

//     getDrivers.forEach(async (doc) => {
//       if (doc.data().is_deleted === false) {
//         const driver = {
//           id: doc.id,
//           driverData: doc.data(),
//           transporter_id: id,
//         };
//         drivers.push(driver);
//       }
//     });
//     return res.render("Users/Driver/transporterDrivers", {
//       drivers: drivers,
//     });
//   } catch (error) {
//     const errors = [];
//     errors.push({ msg: error.message });
//     return res.render("Users/Transporter/displayTransporters", {
//       errors: errors,
//     });
//   }
// };

// Get driver details
exports.driverDetails = async (req, res) => {
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  const errors = [];
  let driver = {};
  try {
    if (transporter_id !== driver_id) {
      const user = await db.collection("users").doc(driver_id);
      const driverData = await user.get();
      const data = await driverData.data();

      if (data === undefined) {
        errors.push({ msg: "Driver not found...!!" });
        return res.render("Errors/errors", {
          errors: errors,
        });
      }

      driver = {
        id: driver_id,
        driverData: data,
        transporterId: transporter_id,
      };
      // console.log("DRIVER DETAILS*************", driver);
    } else {
      const transporter = await db.collection("users").doc(transporter_id);
      const drivers = await transporter.collection("driver_details");
      const driversData = await drivers.get();
      let id = null;
      driversData.forEach((doc) => {
        if (driver_id == doc.data().user_uid) {
          id = doc.id;
        }
      });
      const getDriver = await drivers.doc(id).get();
      const data = await getDriver.data();
      driver = {
        id: driver_id,
        driverData: data,
        transporterId: transporter_id,
      };
      // console.log("DRIVER DETAILS*************", driver);
    }

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

// Change Driver Status Controller
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

// Change Driver Status API
// exports.changeDriverStatus = async (req, res) => {
//   const errors = [];
//   const transporter_id = req.params.transporter_id;
//   const driver_id = req.params.driver_id;
//   let updateData = {};
//   try {
//     // console.log("HELLO YOU ARE IN CHANGE STATUS API OF DRIVER");
//     // console.log("DATA", req.body.reason);
//     // console.log("Driver_id", driver_id);
//     // console.log("Transporter_id", transporter_id);

//     const transporter = await db.collection("users").doc(transporter_id);
//     const getDrivers = await transporter.collection("driver_details").get();

//     let id = null;
//     getDrivers.forEach((doc) => {
//       if (driver_id == doc.data().user_uid) {
//         id = doc.id;
//       }
//     });
//     const getDriverId = await transporter.collection("driver_details").doc(id);

//     if (transporter_id !== driver_id) {
//       const user = await db.collection("users").doc(driver_id);
//       const data = await user.get();
//       const driverData = await data.data();

//       if (driverData === undefined) {
//         errors.push({ msg: "Driver not found...!!" });
//         res.render("Errors/errors", { errors: errors });
//       }

//       const Status = {
//         status: !driverData.status,
//       };
//       // console.log("Status", Status);

//       updateData = {
//         type: "users",
//         id: await db.doc("users/" + driver_id),
//         user_id: await firebase.auth().currentUser.uid,
//         updated_at: new Date(),
//         status: Status.status,
//         reason: req.body.reason,
//       };

//       // console.log("UPDATED DATA", updateData);
//       // await firebase.auth().updateUser(id, { disabled: true });
//       // await firebaseAdmin
//       //   .auth()
//       //   .updateUser(id, { disabled: true })
//       //   .then((userRecord) => {
//       //     // See the UserRecord reference doc for the contents of userRecord.
//       //     console.log("Successfully updated user", userRecord.toJSON());
//       //   })
//       //   .catch((error) => {
//       //     console.log("Error updating user:", error);
//       //   });

//       await user.update(Status);

//       await getDriverId.update(Status);
//     } else {
//       const getDriverData = await getDriverId.get();
//       const data = await getDriverData.data();
//       const Status = {
//         status: !data.status,
//       };
//       // console.log("Status", Status);

//       updateData = {
//         type: "users",
//         id: await db.doc("users/" + transporter_id + "/driver_details/" + id),
//         user_id: await firebase.auth().currentUser.uid,
//         updated_at: new Date(),
//         status: Status.status,
//         reason: req.body.reason,
//       };

//       await getDriverId.update(Status);
//     }

//     await db.collection("status_logs").add(updateData);

//     return res.redirect("back");
//     // res.redirect(`/transporter/transporterDetails/${transporter_id}`);
//     // return true;
//     // return res.redirect(`driver/${transporter_id}/displayDrivers`);
//   } catch (error) {
//     console.log(error);
//   }
// };

/*  Delete Driver Controller */
exports.removeDriver = async (req, res) => {
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  const errors = [];

  try {
    // const transporter_id = req.params.transporter_id;
    // const driver_id = req.params.driver_id;
    // console.log("HELLO YOU ARE IN DELETE API OF TRANSPORTER");
    // console.log("DATA", req.body);
    // console.log("ID", driver_id);
    // console.log("ID", transporter_id);

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

    return res.redirect("back");
    // res.redirect(`/transporter/transporterDetails/${transporter_id}`);
  } catch (error) {
    console.log(error);
    // const errors = [];
    // errors.push({ msg: error.message });
    // return res.render("Errors/errors", {
    //   errors: errors,
    // });
  }
};

// Vrify Driver Controller
exports.verifyDriver = async (req, res) => {
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  const errors = [];

  try {
    // console.log("HELLO YOU ARE IN Verify API OF Driver");
    // console.log("TID", transporter_id);
    // console.log("DID", driver_id);

    const transporter = await db.collection("users").doc(transporter_id);

    const getDrivers = await transporter.collection("driver_details").get();

    let id = null;
    getDrivers.forEach((doc) => {
      if (driver_id == doc.data().user_uid) {
        id = doc.id;
      }
    });
    const getDriverId = await transporter.collection("driver_details").doc(id);

    if (transporter_id === driver_id) {
      await getDriverId.update({
        is_verified: "verified",
      });
    } else {
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

        await getDriverId.update(updateData);
      }
    }
    await transporter.update({ is_request: true });

    await sendAdminNotification(transporter_id, driver_id, "verified");

    // return res.redirect("back");
    return res.redirect(`/transporter/transporterDetails/${transporter_id}`);
  } catch (error) {
    const errors = [];
    console.log(error);
    errors.push({ msg: error.message });
    return res.render("Errors/errors", {
      errors: errors,
    });
  }
};

// Reject Driver Controller
exports.rejectDriver = async (req, res) => {
  const transporter_id = req.params.transporter_id;
  const driver_id = req.params.driver_id;
  const errors = [];

  try {
    // console.log("HELLO YOU ARE IN Verify API OF Driver");
    // console.log("TID", transporter_id);
    // console.log("DID", driver_id);

    const transporter = await db.collection("users").doc(transporter_id);

    const getDrivers = await transporter.collection("driver_details").get();

    let id = null;
    getDrivers.forEach((doc) => {
      if (driver_id == doc.data().user_uid) {
        id = doc.id;
      }
    });
    const getDriverId = await transporter.collection("driver_details").doc(id);

    if (transporter_id === driver_id) {
      await getDriverId.update({
        is_verified: "rejected",
      });
    } else {
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
            is_verified: "rejected",
          };
        }

        await user.update(updateData);

        await getDriverId.update(updateData);
      }
    }
    // await transporter.update({ is_request: true });

    await sendAdminNotification(transporter_id, driver_id, "rejected");

    // return res.redirect("back");
    return res.redirect(`/transporter/transporterDetails/${transporter_id}`);
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
