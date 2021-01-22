var express = require("express");
var customerRouter = express.Router();

const {
  listCustomers,
  customerDetails,
} = require("../controllers/Customer/customer");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Customers
customerRouter.get("/displayCustomers", listCustomers);

// customerRouter.get("/removeVehicle/:vehicle_id", removeVehicle);

customerRouter.get("/customerDetails/:customer_id", customerDetails);

// customerRouter.get("/editVehicle/:vehicle_id", updateVehicle);

// customerRouter.post("/editVehicle/:vehicle_id", updatedVehicle);

module.exports = customerRouter;
