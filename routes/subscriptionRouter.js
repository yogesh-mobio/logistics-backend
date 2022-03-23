var express = require("express");
var subscriptionRouter = express.Router();

const {
  addSubscription,
  addedSubscription,
  listSubscriptions,
  removeSubscription,
  subscriptionDetails,
  updateSubscription,
  updatedSubscription,
} = require("../controllers/Subscription/subscription");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Subscription
subscriptionRouter.get("/createSubscription", addSubscription);

subscriptionRouter.post("/createSubscription", addedSubscription);

subscriptionRouter.get("/list", listSubscriptions);

subscriptionRouter.get(
  "/removeSubscription/:subscription_id",
  removeSubscription
);

subscriptionRouter.get(
  "/subscriptionDetails/:subscription_id",
  subscriptionDetails
);

subscriptionRouter.get(
  "/editSubscription/:subscription_id",
  updateSubscription
);

subscriptionRouter.post(
  "/editSubscription/:subscription_id",
  updatedSubscription
);

module.exports = subscriptionRouter;
