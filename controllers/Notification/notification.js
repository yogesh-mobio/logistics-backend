const { db, messaging } = require("../../config/admin");

exports.sendNotification = async (req, res) => {
  try {
    let ntitle,
      nbody,
      orderId,
      userId,
      userFcmToken = [],
      text;
    if (!req.body.type) {
      return res.status(400).send({ message: "Notification type required." });
    }

    const getTypeText = await db.collection("notification_type").get();
    getTypeText.forEach((item) => {
      if (item.data().type === req.body.type) {
        text = item.data().text;
      }
    });
    if (req.body.type == "accept") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();
      const tFisrtName = await orderData.transporter_details.first_name;
      const tLastName = await orderData.transporter_details.last_name;

      ntitle = "Transporter Accepted";
      nbody = `${tFisrtName} ${tLastName} ${text}`;
      orderId = req.body.orderId;
    } else if (req.body.type == "unloaded") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();

      const dFirstName = await orderData.driver_details.first_name;
      const dLastName = await orderData.driver_details.last_name;
      const orderNo = await orderData.order_id;
      const flatNumber = await orderData.drop_location.flat_name;
      const area = await orderData.drop_location.area;
      const city = await orderData.drop_location.city;
      const state = await orderData.drop_location.state;
      const pincode = await orderData.drop_location.pincode;
      const country = await orderData.drop_location.country;
      const address = `${flatNumber} ${area} ${city} ${pincode} ${state} ${country}`;

      ntitle = "Delivery Confirm";
      nbody = `${dFirstName} ${dLastName} ${text.slice(
        0,
        36
      )} ${orderNo} ${text.slice(37, 61)} ${address}${text.slice(61)}`;
      orderId = req.body.orderId;
    } else if (req.body.type == "confirm") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else {
        const user = await db.collection("users").doc(req.body.userId).get();
        userFcmToken.push(await user.data().fcm_token);

        const order = await db
          .collection("order_details")
          .doc(req.body.orderId)
          .get();
        const orderData = await order.data();
        const customerUid = await orderData.requested_uid;

        const customer = await db.collection("users").doc(customerUid).get();
        const cFirstName = await customer.data().first_name;
        const cLastName = await customer.data().last_name;
        const customerName = `${cFirstName} ${cLastName}`;

        ntitle = "Customer Confirmed";
        nbody = `${customerName} ${text}`;
        orderId = req.body.orderId;
      }
    } else if (req.body.type == "assign") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();
      const tFirstName = await orderData.transporter_details.first_name;
      const tLastName = await orderData.transporter_details.last_name;
      const dFirstName = await orderData.driver_details.first_name;
      const dLastName = await orderData.driver_details.first_name;
      const vehicle_number = await orderData.vehicle_details.vehicle_number;
      ntitle = "Assign Order";
      nbody = `${tFirstName} ${tLastName} ${text.slice(
        0,
        26
      )} ${dFirstName} ${dLastName} ${text.slice(28, 40)} ${vehicle_number}`;
      orderId = req.body.orderId;
    } else if (req.body.type == "driver_reject") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();
      const dFirstName = await orderData.driver_details.first_name;
      const dLastName = await orderData.driver_details.first_name;
      const orderNo = await orderData.order_id;
      ntitle = "Driver Rejected";
      nbody = `${dFirstName} ${dLastName} ${text.slice(
        0,
        25
      )} ${orderNo} ${text.slice(26)}`;
      orderId = req.body.orderId;
    } else if (req.body.type == "transporter_reject") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      } else if (
        req.body.transporterId == "" ||
        req.body.transporterId == undefined
      ) {
        return res.status(400).send({ message: "Transporter id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const oldTransporter = await db
        .collection("users")
        .doc(req.body.transporterId)
        .get();
      const oldTransporterData = await oldTransporter.data();
      const oldTFirstName = await oldTransporterData.first_name;
      const oldTLastName = await oldTransporterData.last_name;
      const oldTransporterName = `${oldTFirstName} ${oldTLastName}`;

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();
      const newTFirstName = await orderData.transporter_details.first_name;
      const newTLastName = await orderData.transporter_details.first_name;
      const newTransporterName = `${newTFirstName} ${newTLastName}`;
      const orderNo = await orderData.order_id;
      ntitle = "Transporter Rejected";
      nbody = `${oldTransporterName} ${text.slice(
        0,
        37
      )} ${orderNo}${text.slice(37)} ${newTransporterName}`;
      orderId = req.body.orderId;
    } else if (req.body.type == "no_transporter_reject") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();

      const tFirstName = await orderData.transporter_details.first_name;
      const tLastName = await orderData.transporter_details.last_name;
      const orderNo = await orderData.order_id;
      ntitle = "Transporter not available";
      nbody = `${tFirstName} ${tLastName} ${text.slice(
        0,
        37
      )} ${orderNo}${text.slice(37)}`;
      orderId = req.body.orderId;
    } else if (req.body.type == "request") {
      userId = req.body.userId;
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      ntitle = "New Request";
      nbody = `${text}`;
      orderId = null;
    } else if (req.body.type == "assign_driver") {
      userId = req.body.userId;
      if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      } else if (req.body.orderId == "" || req.body.orderId == undefined) {
        return res.status(400).send({ message: "Order id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const order = await db
        .collection("order_details")
        .doc(req.body.orderId)
        .get();
      const orderData = await order.data();

      const tFirstName = await orderData.transporter_details.first_name;
      const tLastName = await orderData.transporter_details.last_name;
      const orderNo = await orderData.order_id;

      ntitle = "Driver Assign";
      nbody = `${tFirstName} ${tLastName} ${text.slice(
        0,
        41
      )}${orderNo} ${text.slice(41)}`;
      orderId = req.body.orderId;
    }

    const notification = {
      type: req.body.type,
      is_read: false,
      text: nbody,
      created_at: new Date(),
      user_id: userId,
      title: ntitle,
      orderId: orderId,
    };

    // const fireToken = [userFcmToken];
    const fireToken = userFcmToken;

    let obj = {
      title: ntitle,
      body: nbody,
      date: new Date().toISOString(),
      type: req.body.type,
      orderId: orderId,
      badge: "0",
      sound: "default",
    };
    const payload = {
      data: obj,
      notification: obj,
    };

    messaging
      .sendToDevice(fireToken, payload)
      .then(function (response) {
        // console.log("Have Permission******", response);
        // console.log("PAYLOAD******", payload);
        return response;
      })
      .catch(function (err) {
        console.log("Error occured", err);
      });

    await db.collection("notification").add(notification);
    return res
      .status(200)
      .send({ message: "Notification send successfully...!!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.sendAdminNotification = async (transporter_id, driver_id, type) => {
  let ntitle,
    nbody,
    driverId,
    userId,
    userFcmToken = [],
    text;
  if (!type) {
    return res.status(400).send({ message: "Notification type required." });
  }

  const getTypeText = await db.collection("notification_type").get();
  getTypeText.forEach((item) => {
    if (item.data().type === type) {
      text = item.data().text;
    }
  });
  if (type == "verified") {
    userId = transporter_id;
    if (transporter_id == "" || transporter_id == undefined) {
      return res.status(400).send({ message: "Transporter id is required." });
    } else if (driver_id == "" || driver_id == undefined) {
      return res.status(400).send({ message: "Driver id is required." });
    } else {
      const getTransporterById = await db
        .collection("users")
        .doc(transporter_id);
      const transporter = await getTransporterById.get();
      userFcmToken.push(await transporter.data().fcm_token);
      // console.log("Transporter*****", await transporter.data());

      if (transporter_id === driver_id) {
        const getDrivers = await getTransporterById
          .collection("driver_details")
          .get();

        let id = null;
        getDrivers.forEach((doc) => {
          if (driver_id == doc.data().user_uid) {
            id = doc.id;
          }
        });
        const getDriverId = await getTransporterById
          .collection("driver_details")
          .doc(id);
        const driver = await getDriverId.get();
        const dFirstName = await driver.data().first_name;
        const dLastName = await driver.data().last_name;
        const driverName = `${dFirstName} ${dLastName}`;

        ntitle = "Driver Verified";
        nbody = `${text.slice(0, 14)} ${driverName}${text.slice(14)}`;
        driverId = transporter_id;
      } else {
        const driver = await db.collection("users").doc(driver_id).get();

        const dFirstName = await driver.data().first_name;
        const dLastName = await driver.data().last_name;
        const driverName = `${dFirstName} ${dLastName}`;

        ntitle = "Driver Verified";
        nbody = `${text.slice(0, 14)} ${driverName}${text.slice(14)}`;
        driverId = driver_id;
      }
    }
  } else if (type == "rejected") {
    userId = transporter_id;
    if (transporter_id == "" || transporter_id == undefined) {
      return res.status(400).send({ message: "Transporter id is required." });
    } else if (driver_id == "" || driver_id == undefined) {
      return res.status(400).send({ message: "Driver id is required." });
    } else {
      const getTransporterById = await db
        .collection("users")
        .doc(transporter_id);
      const transporter = await getTransporterById.get();
      userFcmToken.push(await transporter.data().fcm_token);
      // console.log("Transporter*****", await transporter.data());

      if (transporter_id === driver_id) {
        const getDrivers = await getTransporterById
          .collection("driver_details")
          .get();

        let id = null;
        getDrivers.forEach((doc) => {
          if (driver_id == doc.data().user_uid) {
            id = doc.id;
          }
        });
        const getDriverId = await getTransporterById
          .collection("driver_details")
          .doc(id);
        const driver = await getDriverId.get();
        const dFirstName = await driver.data().first_name;
        const dLastName = await driver.data().last_name;
        const driverName = `${dFirstName} ${dLastName}`;

        ntitle = "Driver is not verified";
        nbody = `${text.slice(0, 40)} ${driverName}${text.slice(40)}`;
        driverId = transporter_id;
      } else {
        const driver = await db.collection("users").doc(driver_id).get();

        const dFirstName = await driver.data().first_name;
        const dLastName = await driver.data().last_name;
        const driverName = `${dFirstName} ${dLastName}`;

        ntitle = "Driver is not verified";
        nbody = `${text.slice(0, 40)} ${driverName}${text.slice(40)}`;
        driverId = driver_id;
      }
    }
  }

  const notification = {
    type: type,
    is_read: false,
    text: nbody,
    created_at: new Date(),
    user_id: userId,
    title: ntitle,
    driverId: driverId,
  };

  // const fireToken = [userFcmToken];
  const fireToken = userFcmToken;

  let obj = {
    title: ntitle,
    body: nbody,
    date: new Date().toISOString(),
    type: type,
    driverId: driverId,
    badge: "0",
    sound: "default",
  };
  const payload = {
    data: obj,
    notification: obj,
  };

  messaging
    .sendToDevice(fireToken, payload)
    .then(function (response) {
      console.log("Have Permission******", response);
      console.log("PAYLOAD******", payload);
      return response;
    })
    .catch(function (err) {
      console.log("Error occured", err);
    });

  await db.collection("notification").add(notification);
};

exports.listNotifications = async (req, res) => {
  const notifications = [];

  const data = await db
    .collection("notification")
    .orderBy("created_at", "desc")
    .get();
  data.forEach((doc) => {
    const notification = {
      id: doc.id,
      notificationData: doc.data(),
    };
    notifications.push(notification);
  });

  return res.json({
    notifications: notifications,
  });
};
