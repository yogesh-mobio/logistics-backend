const {
  db,
  firebaseSecondaryApp,
  firebase,
  messaging,
} = require("../../config/admin");
const moment = require("moment");

exports.registerUserReport = async (req, res) => {
  if (req.query.start && req.query.end) {
    var st = new Date(req.query.start);
    var e = new Date(req.query.end);
    console.log("START*****", st);
    console.log("END*****", e);
  }
};

// if (req.query.start && req.query.end) {
//   var st = new Date(req.query.start);
//   var e = new Date(req.query.end);
//   if (st > e) {
//     return res.status(200).send({
//       success: "0",
//       message: "Start date can not be greater than End date",
//     });
//   }
//   let startDate =
//     moment(req.query.start, "YYYY-MM-DD").format("MM-DD-YYYY") + " 00:00:00";
//   let endDate =
//     moment(req.query.end, "YYYY-MM-DD").format("MM-DD-YYYY") + " 23:59:59";
// } else {
//   return res.status(200).send({ success: "0", message: "Input valid dates" });
// }
// let totalUsers = await User.count({
//   where: {
//     createdAt: {
//       [Op.gte]: startDate,
//       [Op.lte]: endDate,
//     },
//   },
// });
