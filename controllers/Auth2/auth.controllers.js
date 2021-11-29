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
    console.log(created_user);
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

exports.sendOtp = async (req, res, next) => {
  try {
    if (req.body.phone_number) {
      const data = await userService.sendOtpPhone(req.body.phone_number);
      if (data) {
        // return res.status(200).json({
        //   status: "Success",
        //   statusCode: 400,
        //   message: "OTP Send Successfully",
        //   data: data,
        // });
        next();
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

exports.verifyOtp = async (req, res, next) => {
  try {
    if (req.body.phone_number && req.body.code.length === 6) {
      const data = await userService.verifyOtpPhone(
        req.body.phone_number,
        req.body.code
      );

      if (data.status === "approved") {
        let user_details = await userService.getUserByPhoneNumber(
          req.body.phone_number
        );
        if (!user_details) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            error: "USER NOT FOUND",
          });
        }

        await userService.updateStatus(user_details);
        let fullname = user_details.name;
        let firstName = fullname.split(" ").slice(0, -1).join(" ");
        let lastName = fullname.split(" ").slice(-1).join(" ");
        let user = {
          first_name: firstName,
          last_name: lastName,
          phone_number: user_details.phone_number,
          is_verified: true,
        };
        let create_transporter = await userService.creatNewTransporter(user);
        if (!create_transporter) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            error: "User Not Registered",
          });
        }
        //await userService.updateStatus(user_);
        // return res.status(200).json({
        //   status: "Success",
        //   statusCode: 200,
        //   message: "OTP VERIFY SUCCESSFULL",
        // });
        next();
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
