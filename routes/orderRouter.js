var express = require("express");
var orderRouter = express.Router();

const { listOrders, orderDetails, exportDetails,filterOrder } = require("../controllers/Order/order");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Orders
orderRouter.get("/list", listOrders);
orderRouter.post("/list", filterOrder);

orderRouter.get("/orderDetails/:order_id", orderDetails);

// orderRouter.post("/neel",exportDetails)
// orderRouter.get("/exportDetails/startDateDetails/endDateDetails",exportDetails)
module.exports = orderRouter;
