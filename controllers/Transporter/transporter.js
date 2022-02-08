const fetchdata = require('node-fetch');
require("dotenv").config();
//const { getAuth, signInWithPhoneNumber } = require("firebase/firebase-auth");
const { v4: uuidv4 } = require('uuid');
const {
  db,
  firebaseSecondaryApp,
  firebase,
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  bucket,
} = require("../../config/admin");
const {
  validateTransporterData,
  validateTransporterDocuments,
} = require("./transporterHelper");

/**Function to get public URL of a Image */
const imagePublicUrl = async (file) => {
  let urls = [];
  let publicUrl;

  if (file.length === 1) {
    const filename =
      file[0].fieldname + "-" + Date.now() + "-" + file[0].originalname;
    let blob = await bucket.file(filename);

    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file[0].mimetype,
      },
    });

    blobWriter.on("finish", async () => {
      console.log("Image Uploaded...!!");
    });
    blobWriter.end(file[0].buffer);

    publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(blob.name)}?alt=media`;

    return publicUrl;
  } else if (file.length > 1) {
    let blobWriter;
    for (let i = 0; i < file.length; i++) {
      const filename =
        file[i].fieldname + "-" + Date.now() + "-" + file[i].originalname;
      let blob = await bucket.file(filename);
      blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file[i].mimetype,
        },
      });

      blobWriter.on("finish", async () => {
        console.log("Image Uploaded...!!");
      });
      blobWriter.end(file[i].buffer);

      publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;
      urls.push(publicUrl);
    }
    return urls;
  }
};

/* Function to get Lat-Long */
// const getLatLong = async (address) => {
//   var geocoder = NodeGeocoder({
//     // provider: process.env.GEO_PROVIDER,
//     provider: "opencage",
//     // apiKey: process.env.GEO_API_KEY,
//     apiKey: "6a6bca1dc71e4877b61d1a38ea7f46db",
//   });

//   // const res = await geocoder.geocode("Rajasthan 302029");
//   // const res = await geocoder.geocode("andheri east mumbai 400069");
//   const res = await geocoder.geocode(address);

//   let max = 0;
//   let latitude = null;
//   let longitude = null;
//   let coordinates = {};

//   if (res.length > 1) {
//     for (var i = 0; i < res.length; i++) {
//       if (res[i].extra.confidence > max) {
//         max = res[i].extra.confidence;
//         latitude = res[i].latitude;
//         longitude = res[i].longitude;
//       }
//     }
//     coordinates = {
//       latitude: latitude,
//       longitude: longitude,
//     };
//   } else {
//     coordinates = {
//       latitude: res[0].latitude,
//       longitude: res[0].longitude,
//     };
//   }
//   return coordinates;
// };

/* Function to convert into boolean */
const isBoolean = async (string) => {
  let boolean = null;
  if (string == "true") {
    boolean = Boolean(!!string);
  } else {
    boolean = Boolean(!string);
  }
  return boolean;
};

/* Create a new Transporter Controller --> GET */
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

/* Add a new Transporter Controller --> POST */
exports.addTransporter = async (req, res) => {
  const vehicleTypes = [];
  const data = await db.collection("vehicles").get();
  data.forEach((doc) => {
    // const vehicleType = { id: doc.id, vehicleTypeData: doc.data() };
    vehicleTypes.push(doc.data().vehicle_type);
  });
  try {
    const data = req.body;
    // console.log("***************", data);

    const files = req.files;
    // console.log("***************", files);

    /**Add document type whenever its required. It is not added yet. */
    const { valid, errors } = validateTransporterData(data);
    const { fileValid, fileErrors } = validateTransporterDocuments(files);
    if (!fileValid || !valid) {
      return res.render("Users/Transporter/addTransporter", {
        vehicleTypes: vehicleTypes,
        fileErrors,
        errors,
      });
    } else {
      const address = {
        area: data.area,
        city: data.city,
        pincode: data.pincode,
      };
     // const stringAddress = JSON.stringify(Object.values(address));
      //const latLong = await getLatLong(stringAddress);

      let status = await isBoolean(data.status);
      // let registered = await isBoolean(data.registered);
      const profilePublicUrl = await imagePublicUrl(files.profile);
      const addressProofPublicUrl = await imagePublicUrl(files.AddressProof);
      const identityProofPublicUrl = await imagePublicUrl(files.IdentityProof);
      const icons = await imagePublicUrl(files.icons);

      let transporterData = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        phone_number: data.phone,
        country_code:"+91",
        user_type: "transporter",
        register_number: data.registerNo,
        is_verified: "pending",
        gst_number: data.gstNo,
        status: status,
        // registered: registered,
        registered: true,
        is_deleted: false,
        reason: "",
        created_at: new Date(),
        priority: 0,
        is_request: false,
        driver_count: 1,
        address: {
          coordinates: 5.565656,
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
        country_code:"+91",
        // user_type: "transporter",
        age: data.Age,
        address_proof: addressProofPublicUrl,
        identity_proof: identityProofPublicUrl,
        created_at: new Date(),
        driver_photo: profilePublicUrl,
        is_assign: false,
        is_deleted: false,
        is_verified: "pending",
        status: status,
        // user_uid: newTransporter.user.uid,
      };
      // console.log(req.files,"req files*****");
      // let iconss = [];
      // for (var i = 0; i < req.files.length; i++) {
      //   console.log(req.files,"req files1****");
      //   const iconId = uuidv4();
      //   let base64 = req.files[i].buffer.toString("base64");
      //   let mimetype = req.files[i].mimetype;
      //   const nameArr = req.files[i].originalname.split(".")
      //   const fileLocation = `vehicle-details/${iconId}.${(nameArr.length !== 0) ? nameArr[nameArr.length - 1] : ""}`
      //   const file = bucket.file(fileLocation)
      //   await file.save(req.files[i].buffer, { contentType: mimetype })
      //   await file.setMetadata({
      //     firebaseStorageDownloadTokens: iconId
      //   })
        
      //   const icon = {
      //     id: iconId,
      //     base64: base64,
      //     dataUrl: `data:${mimetype};${base64}`,
      //     url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileLocation)}?alt=media&token=${iconId}`,
      //     type: mimetype,
      //   };
      //   iconss.push(icon);
      // }

      const vehicleData = {
        vehicle_type: data.vehicleTypeName,
        vehicle_number: data.VehicleNumber,
        comment: data.Comments,
        chassis_number: data.ChassisNumber,
        vehicle_photos: typeof icons === "string" ? [icons] : icons,
        created_at: new Date(),
        is_assign: false,
        is_deleted: false,
        is_verified: "pending",
        status: status,
        //vehicle_photos: icons,
      };

      const notification = {
        // type: req.body.type,
        type: "new_driver",
        is_read: false,
        text: `${transporterData.first_name} ${transporterData.last_name} has added ${driverData.first_name} ${driverData.last_name} to his profile, please verify its details at earliest.`,
        created_at: new Date(),
        // user_id: userId,
        title: "New Driver Added",
        // orderId: orderId,
      };

      const newTransporter = await firebaseSecondaryApp
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      // const newTransporters = await firebaseSecondaryApp
      //   .auth()
      //   .createUser({ 
      //   phone_number: data.phone,
      //   password:data.password,
      // });
      // console.log(newTransporters);

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

      await db.collection("notification").add(notification);

      const getAllUsers = await db.collection("users");
      const getUsers = await getAllUsers.get();
      getUsers.forEach(async (user) => {
        if (
          user.data().user_type === "admin" ||
          user.data().user_type === "Admin"
        ) {
          await getAllUsers
            .doc(user.id)
            .update({ noti_count: user.data().noti_count + 1 });
        }
      });

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

/* Create a new Transporter Controller --> POST */
exports.newTransporter = async (req, res) => {
  console.log("api called")
  console.log(req.body);
  const vehicleTypes = [];
  let coordinates;
  var API_KEY = process.env.GOOGLE_API;
  var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  var address = req.body.address + "," +req.body.area + "," + req.body.city + "," + req.body.state + "," + req.body.country;
  var url = BASE_URL + address + "&key=" + API_KEY;
  const geoData = await fetchdata(url)
  const geoJson = await geoData.json()
  coordinates   = geoJson.results.length !== 0 ? geoJson.results[0].geometry.location : ""
  console.log(coordinates)
//   .then(res => res.json())
//   .then(json => {
//       console.log("data");
//       console.log(json.results[0]);
//       coordinates = json.results[0].geometry.location;
//       console.log(latitude,"lat")
//     //  console.log(latitude,"latitude")
// })
  const data = await db.collection("vehicles").get();
  data.forEach((doc) => {
    // const vehicleType = { id: doc.id, vehicleTypeData: doc.data() };
    vehicleTypes.push(doc.data().vehicle_type);
  });
  try {
    const data = req.body;
    // console.log("***************", data);

    const files = req.files;
    // console.log("***************", files);

    /**Add document type whenever its required. It is not added yet. */
    const { valid, errors } = validateTransporterData(data);
    const { fileValid, fileErrors } = validateTransporterDocuments(files);
    if (!fileValid || !valid) {
      return res.render("Users/Transporter/addTransporter", {
        vehicleTypes: vehicleTypes,
        fileErrors,
        errors,
      });
    } else {
      const address = {
        area: data.area,
        city: data.city,
        pincode: data.pincode,
      };
     // const stringAddress = JSON.stringify(Object.values(address));
      //const latLong = await getLatLong(stringAddress);

      let status = await isBoolean(data.status);
      // let registered = await isBoolean(data.registered);
      const profilePublicUrl = await imagePublicUrl(files.profile);
      const addressProofPublicUrl = await imagePublicUrl(files.AddressProof);
      const identityProofPublicUrl = await imagePublicUrl(files.IdentityProof);
      const icons = await imagePublicUrl(files.icons);

      let transporterData = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        phone_number: data.phone,
        country_code:"+91",
        user_type: "transporter",
        register_number: data.registerNo,
        is_verified: "pending",
        gst_number: data.gstNo,
        status: status,
        // registered: registered,
        registered: true,
        is_deleted: false,
        reason: "",
        created_at: new Date(),
        priority: 0,
        is_request: false,
        driver_count: 1,
        address: {
          coordinates: coordinates,
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
        country_code:"+91",
        // user_type: "transporter",
        age: data.Age,
        address_proof: addressProofPublicUrl,
        identity_proof: identityProofPublicUrl,
        created_at: new Date(),
        driver_photo: profilePublicUrl,
        is_assign: false,
        is_deleted: false,
        is_verified: "pending",
        status: status,
        // user_uid: newTransporter.user.uid,
      };
      // console.log(req.files,"req files*****");
      // let iconss = [];
      // for (var i = 0; i < req.files.length; i++) {
      //   console.log(req.files,"req files1****");
      //   const iconId = uuidv4();
      //   let base64 = req.files[i].buffer.toString("base64");
      //   let mimetype = req.files[i].mimetype;
      //   const nameArr = req.files[i].originalname.split(".")
      //   const fileLocation = `vehicle-details/${iconId}.${(nameArr.length !== 0) ? nameArr[nameArr.length - 1] : ""}`
      //   const file = bucket.file(fileLocation)
      //   await file.save(req.files[i].buffer, { contentType: mimetype })
      //   await file.setMetadata({
      //     firebaseStorageDownloadTokens: iconId
      //   })
        
      //   const icon = {
      //     id: iconId,
      //     base64: base64,
      //     dataUrl: `data:${mimetype};${base64}`,
      //     url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileLocation)}?alt=media&token=${iconId}`,
      //     type: mimetype,
      //   };
      //   iconss.push(icon);
      // }

      const vehicleData = {
        vehicle_type: data.vehicleTypeName,
        vehicle_number: data.VehicleNumber,
        comment: data.Comments,
        chassis_number: data.ChassisNumber,
        vehicle_photos: typeof icons === "string" ? [icons] : icons,
        created_at: new Date(),
        is_assign: false,
        is_deleted: false,
        is_verified: "pending",
        status: status,
        //vehicle_photos: icons,
      };

      const notification = {
        // type: req.body.type,
        type: "new_driver",
        is_read: false,
        text: `${transporterData.first_name} ${transporterData.last_name} has added ${driverData.first_name} ${driverData.last_name} to his profile, please verify its details at earliest.`,
        created_at: new Date(),
        // user_id: userId,
        title: "New Driver Added",
        // orderId: orderId,
      };

      // const newTransporter = await firebaseSecondaryApp
      //   .auth()
      //   .createUserWithEmailAndPassword(data.email, data.password);
     
     




     const userUid = data.userUid;
     const driverUid = data.driverUid;
//        console.log(newTransporter,"new Transpoeter****");

      let transporter = await db
        .collection("users")
        .doc(userUid);
      await transporter.set(transporterData);

      const vehicle = await transporter.collection("vehicle_details").doc();
      await vehicle.set(vehicleData);

      let transporterDriverData = {};
      let newDriverData = {};

      if (data.TransporterAsDriver === "checked") {
        transporterDriverData = {
          ...driverData,
          user_uid: userUid,
        };

        const transporterDriver = await transporter
          .collection("driver_details")
          .doc();
        await transporterDriver.set(transporterDriverData);
      } else {
        // let driverPassword = Math.random().toString(36).slice(-8);

        // const newDriver = await firebaseSecondaryApp
        //   .auth()
        //   .createUserWithEmailAndPassword(data.Email, driverPassword);

        transporterDriverData = {
          ...driverData,
          // temp_password: driverPassword,
          user_uid: driverUid,
        };

        newDriverData = {
          ...driverData,
          // temp_password: driverPassword,
          transporter_uid: userUid,
          user_type: "driver",
        };

        let driver = await db.collection("users").doc(driverUid);
        await driver.set(newDriverData);

        const transporterDriver = await transporter
          .collection("driver_details")
          .doc();
        await transporterDriver.set(transporterDriverData);

        firebaseSecondaryApp.auth().signOut();
      }

      firebaseSecondaryApp.auth().signOut();

      await db.collection("notification").add(notification);

      const getAllUsers = await db.collection("users");
      const getUsers = await getAllUsers.get();
      getUsers.forEach(async (user) => {
        if (
          user.data().user_type === "admin" ||
          user.data().user_type === "Admin"
        ) {
          await getAllUsers
            .doc(user.id)
            .update({ noti_count: user.data().noti_count + 1 });
        }
      });

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

/* Get all the Transporter Controller */
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
    return res.render("Users/Transporter/displayTransporters", {
      transporters: transporters,
    });
  } catch (error) {
    const errors = [];
    errors.push(error.message);
    return res.render("Users/Transporter/displayTransporters", {
      errors: errors,
    });
  }
};
/* Update Transporter Controller --> GET */
exports.updateTransporter = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.transporter_id;
    const data = await db.collection("users").doc(id).get();
    if (data.data() === undefined) {
      errors.push({ msg: "Transporter not found...!!" });
      return res.render("Errors/errors", { errors: errors });
    }
    const TransporterData = data.data();
    return res.render("Users/Transporter/editTransporters", { transporter: TransporterData });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Errors/errors", { errors: errors });
  }
};
/* Update Transporter Controller --> POST */
exports.updatedTransporter = async (req, res) => {
  try {
    const id = req.params.transporter_id;
    const data = req.body;
    const { valid, errors } = validateTransporterData(data);

    if (!valid) {
      if (errors.length > 0) {
        for (var i = 0; i <= errors.length; i++) {
          req.flash("error_msg", errors[i].msg);
          return res.redirect(`/transporter/updateTransporter/${id}`);
         }
      }
    }
    const transporterData = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone_number: data.phone,
      register_number: data.registerNo,
       gst_number: data.gstNo,
      
      address: {
        flatNumber: data.address,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        country: data.country,
      },
    };
    const updateTransporter = db.collection("users").doc(id);
    await updateTransporter.update(transporterData);
    return res.redirect("/transporter/displayTransporters");
    
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.code });
    return res.render("Errors/errors", { errors: errors });
  }
};


/* Change Status of the Transporter Controller */
exports.changeTransporterStatus = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.transporter_id;
    const transporterData = await db.collection("users").doc(id);
    const getTransporterData = await transporterData.get();
    const data = await getTransporterData.data();

    if (!data) {
      errors.push({ msg: "There is no data available" });
      return res.render("Users/Transporter/displayTransporters", {
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

/* Delete transporter Controller */
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
      return res.render("User/Transporter/displayTransporters", {
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

/* Get Details of a Transporter  Controller */
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
      const orders = [];

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

      let getOrders = await db.collection("order_details").get();

      getOrders.forEach(async (doc) => {
        if (doc.data().transporter_uid == id) {
          const order = {
            id: doc.id,
            orderData: doc.data(),
            transporter_id: id,
          };
          orders.push(order);
        }
      });

      let transporter = { id: data.id, transporterData: data.data() };
      return res.render("Users/Transporter/transporterDetails", {
        transporter: transporter,
        drivers: drivers,
        vehicles: vehicles,
        orders: orders,
      });
    }
  } catch (error) {
    req.flash("error_msg", error.message);
    return res.redirect("/transporter/displayTransporters");
  }
};

/* Verify Transporter Controller --> GET */
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

/* Verify Transporter Controller --> POST */
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
  Create Transporter API
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
