var express = require("express");
var customerRouter = express.Router();

const {
  listCustomers,
  customerDetails,
  changeCustomerStatus,
  removeCustomer,
} = require("../controllers/Customer/customer");
const { isAuthenticated } = require("../middleware/authGaurd");
// const { changeUserStatus } = require("../controllers/changeStatus");

// Routes for Customers
customerRouter.get("/displayCustomers", listCustomers);

// customerRouter.delete("/removeCustomer/:customer_id", removeCustomer);
customerRouter.post("/removeCustomer/:customer_id", removeCustomer);

customerRouter.get("/customerDetails/:customer_id", customerDetails);

customerRouter.post("/status/:customer_id", changeCustomerStatus);

// customerRouter.get("/editVehicle/:vehicle_id", updateVehicle);

// customerRouter.post("/editVehicle/:vehicle_id", updatedVehicle);

module.exports = customerRouter;
