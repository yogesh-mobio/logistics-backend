var express = require("express");
var transporterRouter = express.Router();

const {
  newTransporterApi,
  newTransporter,
  listTransporters,
  changeTransporterStatus,
  removeTransporter,
  transporterDetails,
  transporterDriversList,
  transporterVehiclesList,
} = require("../controllers/Transporter/transporter");
const { isAuthenticated } = require("../middleware/authGaurd");
// const { changeUserStatus } = require("../controllers/changeStatus");

// Routes for Transporters
transporterRouter.get("/createTransporter", (req, res) => {
  res.render("Users/Transporter/addTransporter");
});

transporterRouter.post("/createTransporter", newTransporter);

transporterRouter.get("/displayTransporters", listTransporters);

transporterRouter.post("/removeTransporter/:transporter_id", removeTransporter);

transporterRouter.get(
  "/transporterDetails/:transporter_id",
  transporterDetails
);

transporterRouter.post("/status/:transporter_id", changeTransporterStatus);

transporterRouter.get("/:transporter_id/drivers", transporterDriversList);

transporterRouter.get("/:transporter_id/vehicles", transporterVehiclesList);

transporterRouter.get("/:transporter_id/drivers/:driver_id", (req, res) => {
  // res.render("User/Transporter/transporterDrivers");
  res.render("Dashboard/dashboard-copy");
});

transporterRouter.get("/:transporter_id/vehicles/:vehicle_id", (req, res) => {
  // res.render("User/Transporter/transporterDrivers");
  res.render("Dashboard/dashboard-copy");
});

// Routes for transporter API
// transporterRouter.post("/new-transporter-api", newTransporterApi);

module.exports = transporterRouter;
