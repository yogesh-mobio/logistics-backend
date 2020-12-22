var express = require("express");
var router = express.Router();

const { newUser } = require("../controllers/Users/createUser");

router.get("/createUser", (req, res) => {
  res.render("User/addAdmin");
});

router.post("/createUser", newUser);

module.exports = router;
