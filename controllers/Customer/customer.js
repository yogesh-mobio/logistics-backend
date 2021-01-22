const { db } = require("../../config/admin");

exports.listCustomers = async (req, res) => {
  try {
    const customers = [];
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (
        doc.data().user_type == "Customer" ||
        doc.data().user_type == "customer"
      ) {
        const customer = { id: doc.id, customerData: doc.data() };
        customers.push(customer);
      }
    });
    res.render("Users/Customer/displayCustomers", { customers: customers });
  } catch (error) {
    const errors = [];
    errors.push({ msg: error.message });
    return res.render("Users/Customer/displayCustomers", {
      error: errors,
    });
  }
};

exports.customerDetails = async (req, res) => {
  try {
    // const errors = [];
    const id = req.params.customer_id;
    console.log("*****ID*****", id);

    // const data = await db.collection("vehicles").doc(id).get();
    // if (!data) {
    //   errors.push({ msg: "There are no data available" });
    //   res.render("Vehicle/displayVehicles", { errors: errors });
    // }
    // const vehicleData = data.data();

    res.render("Users/Customer/customerDetails", { customer: customerData });
  } catch (error) {
    return res.render({ error: error.message });
  }
};
