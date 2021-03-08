var express = require("express");
var transporterRouter = express.Router();
var multer = require("multer");

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

const {
  // newTransporterApi,
  getNewTransporter,
  newTransporter,
  listTransporters,
  changeTransporterStatus,
  removeTransporter,
  transporterDetails,
  verifyTransporter,
  verifiedTransporter,
  // transporterDriversList,
  // transporterVehiclesList,
} = require("../controllers/Transporter/transporter");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Transporters
transporterRouter.get("/createTransporter", getNewTransporter);

transporterRouter.post(
  "/createTransporter",
  upload.fields([
    { name: "profile" },
    { name: "AddressProof" },
    { name: "IdentityProof" },
    { name: "icons" },
  ]),
  newTransporter
);

transporterRouter.get("/displayTransporters", listTransporters);

transporterRouter.post("/removeTransporter/:transporter_id", removeTransporter);

transporterRouter.get(
  "/transporterDetails/:transporter_id",
  transporterDetails
);

transporterRouter.post("/status/:transporter_id", changeTransporterStatus);

transporterRouter.get("/verify/:transporter_id", verifyTransporter);

transporterRouter.post("/verify/:transporter_id", verifiedTransporter);

// Routes for transporter API
// transporterRouter.post("/new-transporter-api", newTransporterApi);

module.exports = transporterRouter;
