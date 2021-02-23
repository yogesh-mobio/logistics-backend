const { db, messaging } = require("../../config/admin");

exports.sendNotification = async (req, res) => {
  try {
    let ntitle,
      nbody,
      type,
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
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else if (
        req.body.transporterId == "" ||
        req.body.transporterId == undefined
      ) {
        return res.status(400).send({ message: "Transporter id is required." });
      }

      const user = await db.collection("users").doc(req.body.userId).get();
      userFcmToken.push(await user.data().fcm_token);

      const transporter = await db
        .collection("users")
        .doc(req.body.transporterId)
        .get();
      const transporterName = await transporter.data().first_name;

      ntitle = "Transporter Accepted";
      nbody = `${transporterName} ${text}`;
    } else if (req.body.type == "confirm") {
      if (req.body.userId == "" || req.body.userId == undefined) {
        return res.status(400).send({ message: "User id is required." });
      } else {
        const customer = await db
          .collection("users")
          .doc(req.body.userId)
          .get();
        const customerName = await customer.data().first_name;

        if (req.body.transporterId !== "" && req.body.driverId !== "") {
          const driver = await db
            .collection("users")
            .doc(req.body.driverId)
            .get();
          userFcmToken.push(await driver.data().fcm_token);
          const transporter = await db
            .collection("users")
            .doc(req.body.transporterId)
            .get();
          userFcmToken.push(await transporter.data().fcm_token);

          ntitle = "Customer Confirmed";
          nbody = `${customerName} ${text}`;
        } else {
          const transporter = await db
            .collection("users")
            .doc(req.body.transporterId)
            .get();
          userFcmToken.push(await transporter.data().fcm_token);
          ntitle = "Customer Confirmed";
          nbody = `${customerName} ${text}`;
        }
      }
    } else if (req.body.type == "assign") {
    }

    const notification = {
      type: req.body.type,
      text: nbody,
      created_at: new Date(),
      user_id: await db.doc("users/" + req.body.userId),
    };
    // console.log("NOTIFICATION", notification);

    // const fireToken = [userFcmToken];
    const fireToken = userFcmToken;
    //   console.log("**********TOKEN", fireToken);

    let obj = {
      title: ntitle,
      body: nbody,
      date: new Date().toISOString(),
      type: req.body.type,
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

// vendorAcceptedCust : function(jobInstNew,custInst,notyInst,ln){
//     ln = ln || "en";
//     jobInstNew.category = jobInstNew.category || {};
//     jobInstNew.vendor = jobInstNew.vendor || {};
//     return {
//            title    : jobInstNew.category.name,
//            //title   : notyInst.type == "vendor_accept" ? "Vendor Accepted":"Vendor cancelled",
//            body    : notyInst.type == "vendor_accept" ? jobInstNew.vendor.fullName +" has accepted your job and he will assign engineer ASAP.": jobInstNew.vendor.fullName +" has cancelled your job.",
//           "Date"   : jobInstNew.updatedAt.toISOString(),
//           //"Date"   : notyDate.toISOString(),
//           "type"   : notyInst.type,
//           "jobId"  : jobInstNew.id.toString(),
//           "badge"  : (custInst.newNotification || 0).toString(),
//           "sound"  : "default",
//           // "priority":"high",
//           // "force-start":"1"
//         }
//   },
