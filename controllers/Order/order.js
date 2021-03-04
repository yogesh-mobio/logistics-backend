const { db } = require("../../config/admin");

// Get all orders controller
exports.listOrders = async (req, res) => {
  try {
    const orders = [];
    const data = await db.collection("order_details").get();
    data.forEach((doc) => {
      const order = { id: doc.id, orderData: doc.data() };
      orders.push(order);
    });
    return res.render("Order/displayOrders", {
      orders: orders,
    });
  } catch (error) {
    const errors = [];
    errors.push(error.message);
    return res.render("Order/displayOrders", {
      errors: errors,
    });
  }
};

exports.orderDetails = async (req, res) => {
  try {
    const id = req.params.order_id;
    let transporter, driver, customer, order, vehicle;

    const getOrderById = await db.collection("order_details").doc(id);
    const data = await getOrderById.get();
    if (data.data() == undefined) {
      req.flash("error_msg", "Order not found...!!");
      return res.redirect("/order/displayOrders");
    } else {
      const getCustomerById = await db
        .collection("users")
        .doc(data.data().requested_uid);
      const getCustomer = await getCustomerById.get();
      customer = {
        id: getCustomer.id,
        customerData: getCustomer.data(),
      };

      const getTransporterById = await db
        .collection("users")
        .doc(data.data().transporter_uid);
      const getTransporter = await getTransporterById.get();
      transporter = {
        id: getTransporter.id,
        transporterData: getTransporter.data(),
      };

      if (
        data.data().status === "pending" ||
        data.data().status === "rejected"
      ) {
        driver = {
          id: null,
          driverData: null,
        };
        vehicle = {
          id: null,
          vehicleData: null,
        };
      } else {
        const getTransporter = await db
          .collection("users")
          .doc(data.data().transporter_uid);
        const getVehicleById = await getTransporter
          .collection("vehicle_details")
          .doc(data.data().vehicle_details.vehicle_id);
        const getVehicle = await getVehicleById.get();
        vehicle = {
          id: getVehicle.id,
          vehicleData: getVehicle.data(),
        };

        if (
          data.data().transporter_uid === data.data().driver_details.user_uid
        ) {
          const getDriverById = await getTransporter
            .collection("driver_details")
            .doc(data.data().driver_details.driver_id);
          const getDriver = await getDriverById.get();
          driver = {
            id: getDriver.id,
            driverData: getDriver.data(),
          };
        } else {
          const getDriverById = await db
            .collection("users")
            .doc(data.data().driver_details.user_uid);
          const getDriver = await getDriverById.get();
          driver = {
            id: getDriver.id,
            driverData: getDriver.data(),
          };
        }
      }
      order = {
        id: data.id,
        orderData: data.data(),
        transporter: transporter,
        driver: driver,
        customer: customer,
        vehicle: vehicle,
      };
      // console.log("ORDER*********", order);

      return res.render("Order/orderDetails", {
        order: order,
      });
    }
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Errors/errors", { errors: errors });
  }
};
