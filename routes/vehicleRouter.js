var express = require("express");
var vehicleRouter = express.Router();

const {
  newVehicle,
  listVehicles,
  removeVehicle,
  vehicleDetails,
  updateVehicle,
} = require("../controllers/Vehicle/vehicle");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Admin
vehicleRouter.get("/createVehicle", (req, res) => {
  res.render("Vehicle/addVehicle");
});

vehicleRouter.post("/createVehicle", newVehicle);

vehicleRouter.get("/displayVehicles", listVehicles);

// Make temporarily delete still left to add a subscription part
vehicleRouter.get("/removeVehicle/:vehicle_id", removeVehicle);

vehicleRouter.get("/vehicleDetails/:vehicle_id", vehicleDetails);

vehicleRouter.get("/editVehicle/:vehicle_id", updateVehicle);

module.exports = vehicleRouter;
