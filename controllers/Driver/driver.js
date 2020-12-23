const { db } = require("../../config/admin");
const { validateDriverData } = require("./driverHelper");

exports.newDriver = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      //   address: req.body.address,
      //   area: req.body.area,
      //   city: req.body.city,
      //   pincode: req.body.pincode,
      //   state: req.body.state,
      //   country: req.body.country,
      // documentType: req.body.documentType,
      status: req.body.status,
    };

    const { valid, errors } = validateDriverData(data);

    if (!valid) {
      return res.status(400).json(errors);
    }

    let status = null;
    if (data.status == "true") {
      status = Boolean(!!data.status);
    } else {
      status = Boolean(!data.status);
    }

    const driverData = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone_number: data.phone,
      user_type: "Driver",
      status: status,
      createdAt: new Date(),
    };

    // const address = {
    //   flatNumber: data.address,
    //   area: data.area,
    //   city: data.city,
    //   pincode: data.pincode,
    //   state: data.state,
    //   country: data.country,
    // title: data.city,
    // };

    const driver = await db.collection("users").doc();
    await driver.set(driverData);

    // await db
    //   .collection("users")
    //   .doc(transporter.id)
    //   .collection("address")
    //   .add(address);

    res.render("Users/Driver/addDriver", {
      message: "Driver is created...!!",
    });
  } catch (error) {
    return res.render({ error: error.code });
  }
};
