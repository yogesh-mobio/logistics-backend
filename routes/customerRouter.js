var express = require("express");
var customerRouter = express.Router();

const {
  listCustomers,
  customerDetails,
  //   changeStatus,
} = require("../controllers/Customer/customer");
const { isAuthenticated } = require("../middleware/authGaurd");
const { changeUserStatus } = require("../controllers/changeStatus");

// Routes for Customers
customerRouter.get("/displayCustomers", listCustomers);

// customerRouter.get("/removeVehicle/:vehicle_id", removeVehicle);

customerRouter.get("/customerDetails/:customer_id", customerDetails);

customerRouter.post("/status/:_id", changeUserStatus);

// customerRouter.get("/editVehicle/:vehicle_id", updateVehicle);

// customerRouter.post("/editVehicle/:vehicle_id", updatedVehicle);

module.exports = customerRouter;
