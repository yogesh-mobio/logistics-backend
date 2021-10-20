const { db, firebase, bucket, firebaseAdmin } = require("../../config/admin");
const { validateVehicleTypeData } = require("./vehicleTypeHelper");

const { v4: uuidv4 } = require('uuid');

/* Function to get rates */
const vehicleRates = (kmFrom, kmTo, price) => {
  let newAry = [];
  let result = [];
  let obj = {};

  let len = kmFrom.length;
  const doubleLen = len * 2;

  if (typeof kmFrom === "string") {
    obj = {
      start: kmFrom,
      end: kmTo,
      rate: price,
    };
    result.push(obj);
    return result;
  }

  newAry = kmFrom.concat(kmTo, price);
  let newAryLen = newAry.length;

  if (newAryLen % len == 0) {
    for (var i = 0; i < newAryLen; i++) {
      obj = {
        start: newAry[i],
        end: newAry[i + len],
        rate: newAry[i + doubleLen],
      };
      if (
        obj.start != undefined &&
        obj.end != undefined &&
        obj.rate != undefined
      ) {
        result.push(obj);
      }
    }
  }
  return result;
};

/* Create new Vehicle Type Controller */
exports.newVehicleType = async (req, res) => {
  try {
    const data = req.body;

    // console.log("*****DATA*****", data);
    // console.log("FILE", req.files);

    const { valid, errors } = validateVehicleTypeData(data);

    if (!valid) {
      return res.render("VehicleType/addVehicleType", { errors });
    }

    const rates = await vehicleRates(data.kmFrom, data.kmTo, data.price);

    let icons = [];
    for (var i = 0; i < req.files.length; i++) {
      const iconId = uuidv4();
      let base64 = req.files[i].buffer.toString("base64");
      let mimetype = req.files[i].mimetype;
      const nameArr = req.files[i].originalname.split(".")
      const fileLocation = `vehicle-types/${iconId}.${(nameArr.length !== 0) ? nameArr[nameArr.length - 1] : ""}`
      const file = bucket.file(fileLocation)
      await file.save(req.files[i].buffer, { contentType: mimetype })
      await file.setMetadata({
        firebaseStorageDownloadTokens: iconId
      })
      
      const icon = {
        id: iconId,
        base64: base64,
        dataUrl: `data:${mimetype};${base64}`,
        url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileLocation)}?alt=media&token=${iconId}`,
        type: mimetype,
      };
      icons.push(icon);
    }

    const vehicleData = {
      vehicle_type: data.name,
      vahicle_capacity: data.capacity,
      dimensions: {
        v_length: data.vehicleLength,
        v_width: data.vehicleWidth,
        v_height: data.vehicleHeight,
      },
      rates: rates,
      icons: icons,
      is_deleted: false,
    };

    // console.log("*****VEHICLE DATA*****", vehicleData);

    const newVehicle = await db.collection("vehicles").doc();
    await newVehicle.set(vehicleData);
    res.render("VehicleType/addVehicleType");
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("VehicleType/addVehicleType", {
      errors,
    });
  }
};

/* Get List of all the Vehicle Types Controller */
exports.listVehicleTypes = async (req, res) => {
  try {
    const vehicles = [];
    const data = await db.collection("vehicles").get();
    data.forEach((doc) => {
      if (doc.data().is_deleted === false) {
        const vehicle = { id: doc.id, vehicleData: doc.data() };
        vehicles.push(vehicle);
      }
    });
    return res.render("VehicleType/displayVehicleTypes", {
      vehicles: vehicles,
    });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Errors/errors", { errors: errors });
  }
};

/* Remove Vehicle Type Controller */
exports.removeVehicleType = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.vehicleType_id;
    // console.log("*****ID*****", id);

    const getVehicleTypeById = await db.collection("vehicles").doc(id);
    const vehicleTypeData = await getVehicleTypeById.get();
    const vehicleType = await vehicleTypeData.data();
    // console.log("*****VEHICLE TYPE DATA*****", vehicleType);

    if (vehicleType === undefined) {
      errors.push({ msg: "Vehicle-Type not found...!!" });
      res.render("Errors/errors", { errors: errors });
    }

    let counter = 0;
    const orders = await db.collection("order_details").get();
    orders.forEach((doc) => {
      if (doc.data().vehicle_type === vehicleType.vehicle_type) {
        counter++;
      }
    });

    if (counter == 0) {
      const updateData = {
        reason: req.body.reason,
        is_deleted: true,
      };

      const deletedData = {
        type: "vehicle-type",
        id: await db.doc("vehicles/" + id),
        user_id: await firebase.auth().currentUser.uid,
        deleted_at: new Date(),
      };

      // console.log("*******", updateData);

      await getVehicleTypeById.update(updateData);
      await db.collection("deletion_logs").add(deletedData);

      return res.redirect("back");
      // return res.redirect("/vehicle-type/displayVehicleTypes");
    }
    // req.flash(
    //   "error_msg",
    //   `You cannot delete ${vehicleType.vehicle_type} because it is associated with some order`
    // );
    // return res.redirect("/vehicle-type/displayVehicleTypes");

    errors.push({
      msg: `You cannot delete ${vehicleType.vehicle_type} because it is associated with some order`,
    });
    res.render("Errors/errors", {
      errors: errors,
    });
  } catch (error) {
    const errors = [];
    console.log(error);
    errors.push({ msg: error.message });
    return res.render("Errors/errors", {
      errors: errors,
    });
  }
};

/* Get a Details of a Vehicle Type Controller */
exports.vehicleTypeDetails = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.vehicleType_id;

    const data = await db.collection("vehicles").doc(id).get();
    if (data.data() === undefined) {
      errors.push({ msg: "Vehicle-type not found...!!" });
      return res.render("Errors/errors", { errors: errors });
    }
    const vehicleData = data.data();

    return res.render("VehicleType/vehicleTypeDetails", {
      vehicle: vehicleData,
    });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Errors/errors", { errors: errors });
  }
};

/* Update Vehicle Type Controller --> GET */
exports.updateVehicleType = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.vehicleType_id;
    const data = await db.collection("vehicles").doc(id).get();
    if (data.data() === undefined) {
      errors.push({ msg: "Vehicle-type not found...!!" });
      return res.render("Errors/errors", { errors: errors });
    }
    const vehicleData = data.data();
    return res.render("VehicleType/editVehicleType", { vehicle: vehicleData });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Errors/errors", { errors: errors });
  }
};

/* Update Vehicle Type Controller --> POST */
exports.updatedVehicleType = async (req, res) => {
  try {
    const id = req.params.vehicleType_id;

    const data = req.body;
    // console.log("*****DATA*****", data);
    const { valid, errors } = validateVehicleTypeData(data);

    if (!valid) {
      if (errors.length > 0) {
        for (var i = 0; i <= errors.length; i++) {
          req.flash("error_msg", errors[i].msg);
          return res.redirect(`/vehicle-type/editVehicleType/${id}`);
        }
      }
    }

    const rates = await vehicleRates(data.kmFrom, data.kmTo, data.price);

    const vehicleData = {
      vehicle_type: data.name,
      vahicle_capacity: data.capacity,
      dimensions: {
        v_length: data.vehicleLength,
        v_width: data.vehicleWidth,
        v_height: data.vehicleHeight,
      },
      rates: rates,
    };

    // console.log("*****VEHICLE DATA*****", vehicleData);

    const newVehicle = db.collection("vehicles").doc(id);
    await newVehicle.update(vehicleData);
    return res.redirect("/vehicle-type/displayVehicleTypes");
    // return res.render("VehicleType/displayVehicleTypes", {
    //   message: "Vehicle is Added...!!",
    // });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.code });
    return res.render("VehicleType/editVehicleType", { errors: errors });
  }
};
