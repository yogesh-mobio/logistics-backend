const { db } = require("../../config/admin");
const { validateTransporterData } = require("./transporterHelper");

exports.newTransporter = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      address: req.body.address,
      area: req.body.area,
      city: req.body.city,
      pincode: req.body.pincode,
      state: req.body.state,
      country: req.body.country,
      // documentType: req.body.documentType,
      status: req.body.status,
    };

    const { valid, errors } = validateTransporterData(data);

    if (!valid) {
      return res.status(400).json(errors);
    }

    let status = null;
    if (data.status == "true") {
      status = Boolean(!!data.status);
    } else {
      status = Boolean(!data.status);
    }

    const transporterData = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone_number: data.phone,
      user_type: "Transporter",
      status: status,
      createdAt: new Date(),
    };

    const address = {
      flatNumber: data.address,
      area: data.area,
      city: data.city,
      pincode: data.pincode,
      state: data.state,
      country: data.country,
      // title: data.city,
    };

    const transporter = await db.collection("users").doc();
    await transporter.set(transporterData);

    await db
      .collection("users")
      .doc(transporter.id)
      .collection("address")
      .add(address);

    res.render("Users/Transporter/addTransporter", {
      message: "Transporter is created...!!",
    });
  } catch (error) {
    return res.render({ error: error.code });
  }
};

exports.listTransporters = async (req, res) => {
  try {
    const transporters = [];
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (doc.data().user_type == "Transporter") {
        const transporter = { id: doc.id, transporterData: doc.data() };
        transporters.push(transporter);
      }
    });
    res.render("Users/Transporter/displayTransporter", {
      transporters: transporters,
    });
  } catch (error) {
    return res.render({ error: error.code });
  }
};
