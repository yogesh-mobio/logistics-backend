var express = require("express");
var orderRouter = express.Router();

const { listOrders, orderDetails } = require("../controllers/Order/order");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Orders
orderRouter.get("/displayOrders", listOrders);

orderRouter.get("/orderDetails/:order_id", orderDetails);

module.exports = orderRouter;
