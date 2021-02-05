const { db } = require("../../config/admin");
const { validateVehicleTypeData } = require("./vehicleTypeHelper");

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

exports.newVehicleType = async (req, res) => {
  try {
    const data = req.body;

    console.log("*****DATA*****", data);
    console.log("FILE", req.files);

    // const { valid, errors } = validateVehicleTypeData(data);

    // if (!valid) {
    //   return res.render("VehicleType/addVehicleType", { errors });
    // }

    // const rates = await vehicleRates(data.kmFrom, data.kmTo, data.price);

    // const vehicleData = {
    //   vehicle_type: data.name,
    //   vahicle_capacity: data.capacity,
    //   dimensions: {
    //     v_length: data.vehicleLength,
    //     v_width: data.vehicleWidth,
    //     v_height: data.vehicleHeight,
    //   },
    //   rates: rates,
    // };

    // console.log("*****VEHICLE DATA*****", vehicleData);

    // const newVehicle = await db.collection("vehicles").doc();
    // await newVehicle.set(vehicleData);
    // return res.render("VehicleType/addVehicleType", {
    //   message: "Vehicle is Added...!!",
    // });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("VehicleType/addVehicleType", {
      errors,
    });
  }
};

exports.listVehicleTypes = async (req, res) => {
  try {
    const vehicles = [];
    const data = await db.collection("vehicles").get();
    data.forEach((doc) => {
      const vehicle = { id: doc.id, vehicleData: doc.data() };
      vehicles.push(vehicle);
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

exports.removeVehicleType = async (req, res) => {
  try {
    const id = req.params.vehicleType_id;
    // console.log("*****ID*****", id);

    await db.collection("vehicles").doc(id).delete();

    return res.redirect("/vehicle-type/displayVehicleTypes");
  } catch (error) {
    return res.render({ error: error.message });
  }
};

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
