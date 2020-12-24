var express = require("express");
var userRouter = express.Router();

const { newAdmin } = require("../controllers/Admin/admin");

userRouter.get("/createAdmin", (req, res) => {
  res.render("Users/Admin/addAdmin");
});

userRouter.post("/createAdmin", newAdmin);

module.exports = userRouter;
