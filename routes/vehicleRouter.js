var express = require("express");
var vehicleRouter = express.Router();
var multer = require("multer");

const {
  newVehicle,
  listVehicles,
  removeVehicle,
  vehicleDetails,
  updateVehicle,
  updatedVehicle,
} = require("../controllers/Vehicle/vehicle");
const { isAuthenticated } = require("../middleware/authGaurd");

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await cb(null, "./public/uploads/");
  },
  filename: async function (req, file, cb) {
    await cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = async function (req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    await cb(null, true);
  } else {
    await cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Routes for Admin
vehicleRouter.get("/createVehicle", (req, res) => {
  res.render("Vehicle/addVehicle");
});

vehicleRouter.post("/createVehicle", upload.array("icons", 5), newVehicle);

vehicleRouter.get("/displayVehicles", listVehicles);

// Make temporarily delete still left to add a subscription part
vehicleRouter.get("/removeVehicle/:vehicle_id", removeVehicle);

vehicleRouter.get("/vehicleDetails/:vehicle_id", vehicleDetails);

vehicleRouter.get("/editVehicle/:vehicle_id", updateVehicle);

vehicleRouter.post("/editVehicle/:vehicle_id", updatedVehicle);

module.exports = vehicleRouter;
