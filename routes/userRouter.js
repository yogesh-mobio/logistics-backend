var express = require("express");
var userRouter = express.Router();

const { newUser } = require("../controllers/Users/user");

userRouter.get("/createUser", (req, res) => {
  res.render("User/addAdmin");
});

userRouter.post("/createUser", newUser);

module.exports = userRouter;
