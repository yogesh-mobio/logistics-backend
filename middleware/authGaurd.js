const { firebase } = require("../config/admin");

exports.isAuthenticated = (req, res, next) => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser != null) {
    next();
  }
  req.flash("error_msg", "You are not authorized...!!");
  res.redirect("/");
  // res.render("Pages/pages-unauthorized");
  //   console.log("You are not authenticated...!!");
  // res.send("You are not authenticated...!!");
};
