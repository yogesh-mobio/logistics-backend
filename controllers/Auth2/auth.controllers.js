const userService = require("./auth.services");
const { db, firebase } = require("../../config/admin");
const { validateData, validateData2, validateData3 } = require("./validations");


// Sign Up
exports.signup = async (req, res, next) => {
  try {
    const user = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      is_verified: "verified",
      is_registered: false,
      user_type: "transporter",
    };
    const { valid, errors } = validateData(user);
    if (!valid) {
      return res.render("Payment/login", {
        errors,
      });
    }
    const data = await db
      .collection("anonymous")
      .where("phone_number", "==", req.body.phone_number);
    const mydata = await data.get();
    let foundData = null;
    mydata.forEach((doc) => {
      foundData = doc.data();
    });

    if (foundData) {
      errors.push({ msg: "User already exists!" });
      return res.render("Payment/login", {
        errors,
      });
    }
    let fullname = req.body.name;
    let firstName = fullname.split(" ").slice(0, -1).join(" ");
    let lastName = fullname.split(" ").slice(-1).join(" ");
    const transporter = {
      first_name: firstName,
      last_name: lastName,
      phone_number: req.body.phone_number,
      country_code:"+91",
      is_verified: "verified",
      is_registered: false,
      user_type: "transporter",
      email:"",
      gst_number:"",
    };
    await userService.creatNewUser(user);
    await userService.creatNewTransporter(transporter);

    next();
  } catch (error) {
    const errors = [];
    console.log(error);
    errors.push({ msg: error.message });
    return res.render("Errors/errors", {
      errors: errors,
    });
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    if (req.body.phone_number) {
      const data = await userService.sendOtpPhone(req.body.phone_number);
      if (data) {
        next();
      }
    } else {
      errors.push({ msg: "OTP NOT Send Successfully" });
      return res.render("Payment/login", {
        errors,
      });
    }
  } catch (error) {
    const errors = [];
    console.log(error);
    errors.push({ msg: error.message });
    return res.render("Payment/otp", {
      errors: errors,
    });
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    let id, full_name, phone;
    const name = req.body.name;
    const phone_number = req.body.phone_number;
    const { errors } = validateData2();
    if (req.body.phone_number && req.body.code.length === 6) {
      const data = await userService.verifyOtpPhone(
        req.body.phone_number,
        req.body.code
      );

      if (data.status === "approved") {
        const data = await db
          .collection("anonymous")
          .where("phone_number", "==", req.body.phone_number);
        await data.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log(doc.id, " => ", doc.data());
            id = doc.id;
            (full_name = doc.data().name), (phone = doc.data().phone_number);
          });
        });

        const users = {
          is_verified: "verified",
        };
        const my_data = await db.collection("anonymous").doc(id);
        await my_data.update(users);
        let fullname = full_name;
        let firstName = fullname.split(" ").slice(0, -1).join(" ");
        let lastName = fullname.split(" ").slice(-1).join(" ");
        const user = {
          first_name: firstName,
          last_name: lastName,
          phone_number: phone_number,
          user_type: "transporter",
          is_verified: "verified",
        };
        await userService.creatNewTransporter(user);
        next();
      } else {
        errors.push({ msg: "OTP NOT VERIFY Successfully" });
        return res.render("Payment/otp", {
          phone_number,
          name,
          errors,
        });
      }
    } else {
      errors.push({ msg: "OTP NOT VERIFY Successfully" });
      return res.render("Payment/otp", {
        phone_number,
        name,
        errors,
      });
    }
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Payment/otp", {
      errors: errors,
      phone_number,
      name,
    });
  }
};

exports.updateTransporter = async (req, res, next) => {
  console.log(req.body,"mydata")
  let user_data= req.body;
  let name = req.body.name;
  let phone_number = req.body.phone_number;
  let userUid = req.body.userUid;
  try {
    
    let id;
    const user = {
      email: req.body.email,
      gst_number: req.body.gstNo
    };
    const data = await db
      .collection("users")
      .where("phone_number", "==", req.body.phone_number);
    await data.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        id = doc.id;
      });
    });
    const my_data = await db.collection("users").doc(id);
    
    await my_data.update(user);
    
    next();
    
    
    return res.render("Payment/appUrl", {
     user_data
    });
  } catch (error) {
    const errors = [];
    console.log(error,"errorrs")
    if (error.code == "auth/email-already-in-use") {
      errors.push({ msg: "Email already exists!" });
    }
    return res.render("Payment/transporterdetails", {
      errors,
      phone_number,
      name,
      userUid
    });
    // const errors = [];
    // errors.push({ msg: error.message });
    // return res.render("Errors/errors", {
    //   errors: errors,
    // });
  }
};
