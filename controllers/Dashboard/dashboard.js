const { db } = require("../../config/admin");

const transporterCounter = async (req, res) => {
  try {
    let counter = 0;
    const transportersData = await db.collection("users").get();
    transportersData.forEach((doc) => {
      if (
        doc.data().user_type == "Transporter" ||
        doc.data().user_type == "transporter"
      ) {
        counter++;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

const adminCounter = async (req, res) => {
  try {
    let counter = 0;
    const adminsData = await db.collection("users").get();
    adminsData.forEach((doc) => {
      if (doc.data().user_type == "Admin" || doc.data().user_type == "admin") {
        counter++;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

const customersCounter = async (req, res) => {
  try {
    let counter = 0;
    const customersData = await db.collection("users").get();
    customersData.forEach((doc) => {
      if (
        doc.data().user_type == "Customer" ||
        doc.data().user_type == "customer"
      ) {
        counter++;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

const driversCounter = async (req, res) => {
  try {
    let counter = 0;
    const driversData = await db.collection("users").get();
    driversData.forEach((doc) => {
      if (
        doc.data().user_type == "Driver" ||
        doc.data().user_type == "driver"
      ) {
        counter++;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

const orderCounter = async (req, res) => {
  try {
    let counter = 0;
    const orderData = await db.collection("order_details").get();
    orderData.forEach((doc) => {
      counter++;
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

exports.dashboard = async (req, res) => {
  try {
    let data = [];
    let cntTransporter = await transporterCounter();
    let cntAdmin = await adminCounter();
    let cntCustomer = await customersCounter();
    let cntOrder = await orderCounter();
    let cntDriver = await driversCounter();
    const transporter = {
      counter: cntTransporter,
      heading: "Transporters +",
      icon: "mdi mdi-truck",
    };
    const admin = {
      counter: cntAdmin,
      heading: "Admins +",
      icon: "mdi mdi-account-star-variant",
    };
    const customer = {
      counter: cntCustomer,
      heading: "Customers +",
      icon: "mdi mdi-account-multiple",
    };
    const order = {
      counter: cntOrder,
      heading: "Orders +",
      icon: "mdi mdi-cart",
    };
    const driver = {
      counter: cntDriver,
      heading: "Drivers +",
      icon: "mdi mdi-seat-recline-normal",
    };
    data.push(customer);
    data.push(transporter);
    data.push(order);
    data.push(driver);
    data.push(admin);

    res.render("Dashboard/dashboard1", { data: data });
  } catch (error) {
    console.log(error);
  }
};
