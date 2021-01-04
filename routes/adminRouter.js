var express = require("express");
var adminRouter = express.Router();

const {
  newAdmin,
  listAdmins,
  removeAdmin,
} = require("../controllers/Admin/admin");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Admin
adminRouter.get("/createAdmin", isAuthenticated, (req, res) => {
  res.render("Users/Admin/addAdmin");
});

adminRouter.post("/createAdmin", newAdmin);

adminRouter.get("/displayAdmins", listAdmins);

adminRouter.get("/removeAdmin/:id", removeAdmin);

module.exports = adminRouter;
