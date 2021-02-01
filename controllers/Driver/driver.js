const { db } = require("../../config/admin");
// const { validateDriverData } = require("./driverHelper");

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
