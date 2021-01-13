var express = require("express");
var vehicleRouter = express.Router();

const { newVehicle, listVehicles } = require("../controllers/Vehicle/vehicle");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Admin
vehicleRouter.get("/createVehicle", isAuthenticated, (req, res) => {
  res.render("Vehicle/addVehicle");
});

vehicleRouter.post("/createVehicle", newVehicle);

// vehicleRouter.get("/displayVehicle");

// vehicleRouter.get("/removeAdmin/:id");

module.exports = vehicleRouter;
