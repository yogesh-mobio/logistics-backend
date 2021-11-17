const bcrypt = require("bcryptjs");
const User = require("../../models/users");
const userService = require("./auth.services");

// Sign Up
exports.signup = async (req, res, next) => {
  try {
    let user = new User(req.body);
    let already_exist = await userService.getUserByPhoneNumber(
      user.phone_number
    );
    if (already_exist) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        error: "User Already Exist",
      });
    }

    let created_user = await userService.creatNewUser(user);
    if (!created_user) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        error: "User Not Registered",
      });
    }
    next();
  } catch (errors) {
    res.status(500).json({
      status: "Error",
      statusCode: 500,
      error: errors.message,
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    if (req.body.phone_number) {
      const data = await userService.sendOtpPhone(req.body.phone_number);
      if (data) {
        return res.status(200).json({
          status: "Success",
          statusCode: 400,
          message: "OTP Send Successfully",
          data: data,
        });
      }
    } else {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        error: "OTP NOT Send Successfully",
        data: data,
      });
    }
  } catch (errors) {
    res.status(500).json({
      status: "Error",
      statusCode: 500,
      error: errors.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    if (req.query.phone_number && req.query.code.length === 6) {
      const data = await userService.verifyOtpPhone(
        req.query.phone_number,
        req.query.code
      );

      if (data.status === "approved") {
        let user_details = await userService.getUserByPhoneNumber(
          req.query.phone_number
        );
        if (!user_details) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            error: "USER NOT FOUND",
          });
        }

        await userService.updateStatus(user_details);

        return res.status(200).json({
          status: "Success",
          statusCode: 200,
          message: "OTP VERIFY SUCCESSFULL",
        });
      } else {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          error: "OTP NOT VERIFY Successfully",
          data: data,
        });
      }
    } else {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        error: "OTP NOT VERIFY Successfully",
        data: data,
      });
    }
  } catch (errors) {
    res.status(500).json({
      status: "Error",
      statusCode: 500,
      error: errors.message,
    });
  }
};
