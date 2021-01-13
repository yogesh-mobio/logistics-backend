const { db } = require("../../config/admin");
const { validateVehicleData } = require("./vehicleHelper");

exports.newVehicle = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      capacity: req.body.capacity,
      vehicleLength: req.body.vehicleLength,
      vehicleWidth: req.body.vehicleWidth,
      vehicleHeight: req.body.vehicleHeight,
      //   price100: req.body.price100,
      //   price200: req.body.price200,
      //   price300: req.body.price300,
      //   price400: req.body.price400,
      //   price500: req.body.price500,
      //   price500Plus: req.body.price500Plus,
    };

    const { valid, errors } = validateVehicleData(data);

    if (!valid) {
      res.render("Vehicle/addVehicle", { errors });
    }

    const vehicleData = {
      vehicle_name: data.name,
      vahicle_capacity: data.capacity,
      dimensions: {
        v_length: data.vehicleLength,
        v_width: data.vehicleWidth,
        v_height: data.vehicleHeight,
      },
      //   rates: {
      //     rate_0to100: data.price100,
      //     rate_100to200: data.price200,
      //     rate_200to300: data.price300,
      //     rate_300to400: data.price400,
      //     rate_400to500: data.price500,
      //     rate_above_500: data.price500Plus,
      //   },
    };

    const newVehicle = await db.collection("vehicles").doc();
    await newVehicle.set(vehicleData);
    res.render("Vehicle/addVehicle", {
      message: "Vehicle is Added...!!",
    });
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
    const data = await db
      .collection("vehicles")
      .doc("BJBnGetvht75h3E9Zy1g")
      .get();
    console.log("********************************", data.data());
  } catch (error) {
    return res.render({ error: error.code });
  }
};
