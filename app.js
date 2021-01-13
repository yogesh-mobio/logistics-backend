var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var expressLayouts = require("express-ejs-layouts");
var cors = require("cors");
var session = require("express-session");
var flash = require("connect-flash"); //

var router = require("./routes/router");
var Authrouter = require("./routes/Authrouter");
var AdminRouter = require("./routes/adminRouter");
var VehicleRouter = require("./routes/vehicleRouter");
// var passwordRouter = require("./routes/passwordRouter");

var app = express();

app.use("/", Authrouter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30000 },
  })
);

// Connect Flash
app.use(flash());

// error handler
app.use(async (req, res, next) => {
  // res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  // res.locals.error = req.flash("error");
  next();
});

app.use(cors());

app.use("/", router);
app.use("/admin", AdminRouter);
app.use("/vehicle", VehicleRouter);
// app.use("/password", passwordRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   //   render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
