var express = require("express");
var vehicleTypeRouter = express.Router();
var multer = require("multer");

const {
  newVehicleType,
  listVehicleTypes,
  removeVehicleType,
  vehicleTypeDetails,
  updateVehicleType,
  updatedVehicleType,
} = require("../controllers/VehicleType/vehicleType");
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
vehicleTypeRouter.get("/createVehicleType", (req, res) => {
  res.render("VehicleType/addVehicleType");
});

vehicleTypeRouter.post(
  "/createVehicleType",
  upload.array("icons", 5),
  newVehicleType
);

vehicleTypeRouter.get("/displayVehicleTypes", listVehicleTypes);

// Make temporarily delete still left to add a subscription part
vehicleTypeRouter.get("/removeVehicleType/:vehicleType_id", removeVehicleType);

vehicleTypeRouter.get(
  "/vehicleTypeDetails/:vehicleType_id",
  vehicleTypeDetails
);

vehicleTypeRouter.get("/editVehicleType/:vehicleType_id", updateVehicleType);

vehicleTypeRouter.post("/editVehicleType/:vehicleType_id", updatedVehicleType);

module.exports = vehicleTypeRouter;
