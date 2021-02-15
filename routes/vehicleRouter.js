var express = require("express");
var vehicleRouter = express.Router();

const {
  transporterVehiclesList,
  vehicleDetails,
  removeVehicle,
  changeVehicleStatus,
  verifyVehicle,
} = require("../controllers/Vehicle/vehicle");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Drivers
// vehicleRouter.get("/:transporter_id/displayVehicles", transporterVehiclesList);

vehicleRouter.get(
  "/:transporter_id/vehicleDetails/:vehicle_id",
  vehicleDetails
);

vehicleRouter.post("/:transporter_id/removeVehicle/:vehicle_id", removeVehicle);

vehicleRouter.post("/:transporter_id/status/:vehicle_id", changeVehicleStatus);

vehicleRouter.post("/:transporter_id/verifyVehicle/:vehicle_id", verifyVehicle);

module.exports = vehicleRouter;
