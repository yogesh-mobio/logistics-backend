var express = require("express");
var RegisterRouter = express.Router();
const authController = require("../controllers/Auth2/auth.controllers");

RegisterRouter.post(
  "/register",
  authController.signup,
  authController.sendOtp,
  (req, res) => {
    // console.log("otp")
    // console.log(req);
    // console.log(req.body,"Bodyyyyy");

    const name = req.body.name;
    const phone_number = req.body.phone_number;

    res.render("Payment/otp", { phone_number, name });
    // res.render('Payment/otp')
  }
);

RegisterRouter.get("/register", (req, res) => {
  res.render("Payment/login2");
});

RegisterRouter.post("/otp", authController.verifyOtp, async (req, res) => {
  const otp = req.body;

  res.render("Payment/transporterdetails", otp);
});

module.exports = RegisterRouter;
