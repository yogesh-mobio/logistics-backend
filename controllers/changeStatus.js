const { db } = require("../config/admin");

exports.changeUserStatus = async (req, res) => {
  try {
    const id = req.params._id;
    const userData = await db.collection("users").doc(id);
    const getUserData = await userData.get();
    const data = await getUserData.data();

    let status = null;
    if (getUserData) {
      status = !data.status;
    }
    await userData.update({ status });
    res.redirect("/customer/displayCustomers");
  } catch (error) {
    console.log(error);
  }
};
