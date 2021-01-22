const { db } = require("../../config/admin");
const { validateVehicleData } = require("./vehicleHelper");

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

exports.newVehicle = async (req, res) => {
  try {
    const data = req.body;

    console.log("*****DATA*****", data);
    console.log("FILE", req.files);

    // const { valid, errors } = validateVehicleData(data);

    // if (!valid) {
    //   res.render("Vehicle/addVehicle", { errors });
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
    // res.render("Vehicle/addVehicle", {
    //   message: "Vehicle is Added...!!",
    // });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    res.render("Vehicle/addVehicle", {
      errors,
    });
  }
};

exports.listVehicles = async (req, res) => {
  try {
    const vehicles = [];
    const data = await db.collection("vehicles").get();
    data.forEach((doc) => {
      const vehicle = { id: doc.id, vehicleData: doc.data() };
      vehicles.push(vehicle);
    });
    res.render("Vehicle/displayVehicles", { vehicles: vehicles });
  } catch (error) {
    return res.render({ error: error.message });
  }
};

exports.removeVehicle = async (req, res) => {
  try {
    const id = req.params.vehicle_id;
    // console.log("*****ID*****", id);

    await db.collection("vehicles").doc(id).delete();

    res.redirect("/vehicle/displayVehicles");
  } catch (error) {
    return res.render({ error: error.message });
  }
};

exports.vehicleDetails = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.vehicle_id;

    const data = await db.collection("vehicles").doc(id).get();
    if (!data) {
      errors.push({ msg: "There are no data available" });
      res.render("Vehicle/displayVehicles", { errors: errors });
    }
    const vehicleData = data.data();

    res.render("Vehicle/vehicleDetails", { vehicle: vehicleData });
  } catch (error) {
    return res.render({ error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const errors = [];
    const id = req.params.vehicle_id;
    const data = await db.collection("vehicles").doc(id).get();
    if (!data) {
      errors.push({ msg: "There are no data available" });
      res.render("Vehicle/editVehicle", { errors: errors });
    }
    const vehicleData = data.data();
    res.render("Vehicle/editVehicle", { vehicle: vehicleData });
  } catch (error) {
    return res.render({ error: error.message });
  }
};

exports.updatedVehicle = async (req, res) => {
  try {
    const id = req.params.vehicle_id;

    const data = req.body;
    // console.log("*****DATA*****", data);
    const { valid, errors } = validateVehicleData(data);

    if (!valid) {
      res.render(`Vehicle/editVehicle/${id}`, { errors });
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
    res.redirect("/vehicle/displayVehicles");
    // res.render("Vehicle/displayVehicles", {
    //   message: "Vehicle is Added...!!",
    // });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.code });
    return res.render("Vehicle/editVehicles", { errors: errors });
  }
};
