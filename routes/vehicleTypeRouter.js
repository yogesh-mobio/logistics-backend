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

var storage = multer.memoryStorage();

// const fileFilter = async function (req, file, cb) {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg"
//   ) {
//     await cb(null, true);
//   } else {
//     await cb(null, false);
//   }
// };

var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
  // fileFilter: fileFilter,
});

// Routes for Vehicle-Type
vehicleTypeRouter.get("/createVehicleType", (req, res) => {
  res.render("VehicleType/addVehicleType");
});

vehicleTypeRouter.post(
  "/createVehicleType",
  upload.array("icons", 5),
  // upload.single("icons"),
  newVehicleType
);

vehicleTypeRouter.get("/list", listVehicleTypes);

// Make temporarily delete still left to add a subscription part
vehicleTypeRouter.post("/removeVehicleType/:vehicleType_id", removeVehicleType);

vehicleTypeRouter.get(
  "/vehicleTypeDetails/:vehicleType_id",
  vehicleTypeDetails
);

vehicleTypeRouter.get("/editVehicleType/:vehicleType_id", updateVehicleType);

vehicleTypeRouter.post("/editVehicleType/:vehicleType_id", updatedVehicleType);

module.exports = vehicleTypeRouter;
