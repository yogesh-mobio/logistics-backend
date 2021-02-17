const { db } = require("../../config/admin");

/* Function to count every user-type */
const userCounter = async () => {
  try {
    let cntTransporter = {};
    let cntCustomer = {};
    let cntDriver = {};
    let cntAdmin = {};

    const transporters = [];
    const customers = [];
    const drivers = [];
    const admins = [];

    const users = await db.collection("users").get();
    users.forEach((doc) => {
      if (
        (doc.data().user_type == "Transporter" ||
          doc.data().user_type == "transporter") &&
        doc.data().is_deleted == false
      ) {
        transporters.push(doc.data());
      } else if (
        (doc.data().user_type == "Admin" || doc.data().user_type == "admin") &&
        doc.data().is_deleted == false
      ) {
        admins.push(doc.data());
      } else if (
        (doc.data().user_type == "Customer" ||
          doc.data().user_type == "customer") &&
        doc.data().is_deleted == false
      ) {
        customers.push(doc.data());
      } else if (
        (doc.data().user_type == "Driver" ||
          doc.data().user_type == "driver") &&
        doc.data().is_deleted == false
      ) {
        drivers.push(doc.data());
      }
    });

    cntTransporter = {
      counter: transporters.length,
      heading: "Transporters",
      icon: "mdi mdi-truck",
    };
    cntDriver = {
      counter: drivers.length,
      heading: "Drivers",
      icon: "mdi mdi-seat-recline-normal",
    };
    cntCustomer = {
      counter: customers.length,
      heading: "Customers",
      icon: "mdi mdi-account-multiple",
    };
    cntAdmin = {
      counter: admins.length,
      heading: "Admins",
      icon: "mdi mdi-account-star-variant",
    };

    return { cntAdmin, cntTransporter, cntDriver, cntCustomer };
  } catch (error) {
    console.log(error);
  }
};

/*  Function to count Order */
const orderCounter = async () => {
  try {
    let cntPendingOrder = {};
    let cntOnGoingOrder = {};
    let cntCompleteOrder = {};

    const pendingOrder = [];
    const onGoingOrder = [];
    const completeOrder = [];

    const orders = await db.collection("order_details").get();
    orders.forEach((doc) => {
      if (doc.data().status == "pending" || doc.data().status == "Pending") {
        pendingOrder.push(doc.data());
      } else if (
        doc.data().status == "ongoing" ||
        doc.data().status == "Ongoing"
      ) {
        onGoingOrder.push(doc.data());
      } else if (
        doc.data().status == "complete" ||
        doc.data().status == "Complete"
      ) {
        completeOrder.push(doc.data());
      }
    });

    cntPendingOrder = {
      counter: pendingOrder.length,
      heading: "Pending  Orders",
      icon: "mdi mdi-cart",
    };
    cntOnGoingOrder = {
      counter: onGoingOrder.length,
      heading: "Ongoing Orders",
      icon: "mdi mdi-cart",
    };
    cntCompleteOrder = {
      counter: completeOrder.length,
      heading: "Complete Orders",
      icon: "mdi mdi-cart",
    };

    return { cntPendingOrder, cntOnGoingOrder, cntCompleteOrder };
  } catch (error) {
    console.log(error);
  }
};

/* Dashboard Controller */
exports.dashboard = async (req, res) => {
  try {
    let data = [];

    let users = await userCounter();
    Object.values(users).forEach((val) => {
      data.push(val);
    });

    let orders = await orderCounter();
    Object.values(orders).forEach((val) => {
      data.push(val);
    });

    res.render("Dashboard/dashboard1", { data: data });
  } catch (error) {
    console.log(error);
  }
};
