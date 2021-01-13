const { db } = require("../../config/admin");

const transporterCounter = async () => {
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

const adminCounter = async () => {
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

const customersCounter = async () => {
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

const driversCounter = async () => {
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

const pendingOrderCounter = async () => {
  try {
    let counter = 0;
    const orderData = await db.collection("order_details").get();
    orderData.forEach((doc) => {
      if (doc.data().status == "pending" || doc.data().status == "Pending") {
        counter++;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

const onGoingOrderCounter = async () => {
  try {
    let counter = 0;
    const orderData = await db.collection("order_details").get();
    orderData.forEach((doc) => {
      if (doc.data().status == "ongoing" || doc.data().status == "Ongoing") {
        counter++;
      }
    });
    return counter;
  } catch (error) {
    console.log(error);
  }
};

const completeOrderCounter = async () => {
  try {
    let counter = 0;
    const orderData = await db.collection("order_details").get();
    orderData.forEach((doc) => {
      if (doc.data().status == "complete" || doc.data().status == "Complete") {
        counter++;
      }
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
    let cntPendingOrder = await pendingOrderCounter();
    let cntOnGoingOrder = await onGoingOrderCounter();
    let cntCompleteOrder = await completeOrderCounter();
    let cntDriver = await driversCounter();

    const transporter = {
      counter: cntTransporter,
      heading: "Transporters",
      icon: "mdi mdi-truck",
    };
    const admin = {
      counter: cntAdmin,
      heading: "Admins",
      icon: "mdi mdi-account-star-variant",
    };
    const customer = {
      counter: cntCustomer,
      heading: "Customers",
      icon: "mdi mdi-account-multiple",
    };
    const pendingOrder = {
      counter: cntPendingOrder,
      heading: "Pending  Orders",
      icon: "mdi mdi-cart",
    };
    const onGoingOrder = {
      counter: cntOnGoingOrder,
      heading: "Ongoing Orders",
      icon: "mdi mdi-cart",
    };
    const completeOrder = {
      counter: cntCompleteOrder,
      heading: "Ongoing Orders",
      icon: "mdi mdi-cart",
    };
    const driver = {
      counter: cntDriver,
      heading: "Drivers",
      icon: "mdi mdi-seat-recline-normal",
    };
    data.push(customer);
    data.push(transporter);
    data.push(pendingOrder);
    data.push(onGoingOrder);
    data.push(completeOrder);
    data.push(driver);
    data.push(admin);

    res.render("Dashboard/dashboard1", { data: data });
  } catch (error) {
    console.log(error);
  }
};
