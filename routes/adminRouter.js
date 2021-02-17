var express = require("express");
var adminRouter = express.Router();

const {
  newAdmin,
  listAdmins,
  removeAdmin,
  adminDetails,
  changeAdminStatus,
} = require("../controllers/Admin/admin");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Admin
adminRouter.get("/createAdmin", (req, res) => {
  res.render("Users/Admin/addAdmin");
});

adminRouter.post("/createAdmin", newAdmin);

adminRouter.get("/displayAdmins", listAdmins);

adminRouter.post("/removeAdmin/:admin_id", removeAdmin);

adminRouter.get("/adminDetails/:admin_id", adminDetails);

adminRouter.post("/status/:admin_id", changeAdminStatus);

module.exports = adminRouter;
