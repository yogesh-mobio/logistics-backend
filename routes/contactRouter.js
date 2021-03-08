var express = require("express");
var contactRouter = express.Router();

const {
  listContacts,
  contactDetails,
} = require("../controllers/Contact/contact");
const { isAuthenticated } = require("../middleware/authGaurd");

// Routes for Orders
contactRouter.get("/displayContacts", listContacts);

contactRouter.get("/contactDetails/:contact_id", contactDetails);

module.exports = contactRouter;
