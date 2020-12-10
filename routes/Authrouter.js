var express = require("express");
var Authrouter = express.Router();

//Authentications all TABs.

Authrouter.get("/pages-coming-soon", async (req, res) => {
  await res.render("Pages/pages-coming-soon");
});
Authrouter.get("/pages-lock-screen", async (req, res) => {
  await res.render("Pages/pages-lock-screen");
});

Authrouter.get("/", async (req, res) => {
  await res.render("Pages/pages-login");
});

Authrouter.get("/pages-maintenance", async (req, res) => {
  await res.render("Pages/pages-maintenance");
});
Authrouter.get("/pages-recoverpw", async (req, res) => {
  await res.render("Pages/pages-recoverpw");
});

Authrouter.get("/pages-register", async (req, res) => {
  await res.render("Pages/pages-register");
});

Authrouter.get("/pages-comingsoon", async (req, res) => {
  await res.render("Pages/pages-comingsoon");
});

module.exports = Authrouter;
