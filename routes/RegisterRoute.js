var express = require("express");
var RegisterRouter = express.Router();
const authController = require("../controllers/Auth2/auth.controllers");

RegisterRouter.post(
  "/register",
  authController.signup,
  //authController.sendOtp,
  (req, res) => {
    // const name = req.body.name;
    // const phone_number = req.body.phone_number;
    const data = req.body;
    res.render("Payment/transporterdetails",data);
  }
);

RegisterRouter.post("/resend", authController.sendOtp, (req, res) => {
  console.log("resend");
  console.log(req.body, "Bodyyyyy");
  const name = req.body.name;
  const phone_number = req.body.phone_number;
  res.render("Payment/otp", { phone_number, name });
});

RegisterRouter.get("/register", (req, res) => {
  res.render("Payment/login");
});

RegisterRouter.post("/otp", authController.verifyOtp, async (req, res) => {
  const otp = req.body;

  res.render("Payment/transporterdetails", otp);
});

RegisterRouter.post(
  "/updatetransporter",
  authController.updateTransporter

  // authController.sendOtp,
  // (req, res) => {
  //   const name = req.body.name;
  //   const phone_number = req.body.phone_number;
  //   res.render("Payment/otp", { phone_number, name });
  // }
);

module.exports = RegisterRouter;
