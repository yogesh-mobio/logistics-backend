const { db } = require("../../config/admin");
var express = require('express')
const moment = require("moment");
const json2xls = require('json2xls');
const app = express()
const fs = require('fs');
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

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

/* Post request for export Data */
// exports.filterOrder = async (req, res) => {

//   const date = req.body;
//   let DD = [];
  
//   var st = new Date(date.start);
//   var e = new Date(date.end);
//   let transporter, driver, customer, order, vehicle;
//   // const startDate = moment(st, "YYYY-MM-DD").format("DD-MM-YYYY")+ " 00:00:00";
//   // const endDate = moment(e, "YYYY-MM-DD").format("DD-MM-YYYY")+ " 23:59:59";

//   try {  
//     const data = await db.collection("order_details")
//     .where("created_at",">=",st)
//     .where("created_at","<=",e)
//     .get();
//     data.forEach(async(doc) => {
//       let fd = doc.data().created_at.toDate();
//       let filterdata = moment(fd).format("DD-MM-YYYY");
//       // console.log(typeof filterdata,"filterData")
//       // console.log(typeof startDate,"startDate")
//       // if(filterdata >= startDate && filterdata <= endDate){
//       //   // console.log(typeof filterdata,"checkon")
//       // }
//       const order = { 
//         id: doc.id, 
//         orderData: doc.data() 
//       };
//       DD.push(order);
//     });
//     // DD.push(orders)
//     // console.log(DD,"filter order")
//     // for(let i = 0; i<DD.length;i++){
//     //   oId.push(DD[i])
//     // }
//     console.log(DD.length,"??????????????????All ID ???????")
//     return res.render("Order/displayOrders", {
//       orders: DD,
//     });
//   } catch (error) {
//     const errors = [];
//     errors.push(error.message);
//     return res.render("Order/displayOrders", {
//       errors: errors,
//     });
//   }
// };


exports.filterOrder = async (req, res) => {
  const date = req.body;
    
    if(date.start == "" || date.end == ""){
      req.flash("error_msg", "Please Check date!");
      return res.redirect("/order/list");
    }
    var st = new Date(date.start);
    var e = new Date(date.end);
    let transporter, driver, customer, order, vehicle;

    if( st > new Date()){
      req.flash("error_msg", "Please Check date!");
      return res.redirect("/order/list");
    }
    
  
    try {  
      let DD = [];
      let STATUS = [];
      let TDATA = [];
      let PDATA = [];
      let DDATA = [];
      const data = await db.collection("order_details")
      .where("created_at",">=",st)
      .where("created_at","<=",e)
      .get();
      data.forEach(async(doc) => {
        let fd = doc.data().created_at.toDate();
        let filterdata = moment(fd).format("DD-MM-YYYY");
        // console.log(doc.data().status)
        const status = {
          id: doc.id,
          status:doc.data().status,
        }
        const tData = {
          id: doc.id,
          transporterData: doc.data().transporter_details,
        }
        const pData = {
          id: doc.id,
          pickupLocationData:doc.data().pickup_location,
        }
        const dData = {
          id: doc.id,
          dropLocationData:doc.data().drop_location
        }
        const order = { 
          id: doc.id,
          orderData: doc.data(),
          // status:doc.data().status,
          // transporterData: doc.data().transporter_details,
          // pickupLocationData:doc.data().pickup_location,
          // dropLocationData:doc.data().drop_location
        };
        
        DD.push(order);
        STATUS.push(status);
        TDATA.push(tData);
        PDATA.push(pData);
        DDATA.push({
          "Id": dData.id,
          // "Last Name": dData.dropLocationData.last_name,
          "Status":status.status,
          // "Transporter Uid":tData.transporter_uid,
          "Transporter Phone Number":tData.transporterData.phone_number,
          "GST Number":tData.transporterData.gst_number,
          "Transporter Name":tData.transporterData.first_name + " " + tData.transporterData.last_name,
          "DeliveredBy":dData.dropLocationData.first_name + " " +dData.dropLocationData.last_name,
          "Delivered Phone Number":dData.dropLocationData.phone_number,
          "Email":dData.dropLocationData.email,
          "Pin Code":dData.dropLocationData.pincode,
          "Area":dData.dropLocationData.area,
          "City":dData.dropLocationData.city,
          "State":dData.dropLocationData.state,
          "Country":dData.dropLocationData.country,
          "PickupBy":pData.pickupLocationData.first_name + " " + pData.pickupLocationData.last_name,
          "Pickup Phone Number":pData.pickupLocationData.phone_number,
          "Pickup Pin Code":pData.pickupLocationData.pincode,
          "Pickup Flat Name":pData.pickupLocationData.flat_name,
          "Pickup Area":pData.pickupLocationData.area,
          "Pickup City":pData.pickupLocationData.city,
          "Pickup Country":pData.pickupLocationData.country,
          "Dimensions":pData.pickupLocationData.dimensions,
          "Parcel Value":pData.pickupLocationData.parcel_value,
          "Pickup Time":pData.pickupLocationData.pickup_date_time
        });

      });
     
      
      // const workbook = new excelJS.Workbook();
      // const workSheet = workbook.addWorksheet("Order Details");
      // const workSheetpicklocation = workbook.addWorksheet("Pickup Location Details");
      // const workSheetofdroplocation = workbook.addWorksheet("Drop Location Details");
      // const workSheetoftransporterdetails = workbook.addWorksheet("Transporter Details");
      
      // workSheet.columns = [
      //   { header:'S.no',key:'s_no',width:5 },
      //   { header:'ID',key:'id',width:30 },
      //   { header:'Order Id',key:'order_id',width:20 },
      //   { header:'Payment Mod',key:'payment_mode',width:20 },
      //   { header:'Price',key:'price',width:20 },
      //   { header:'Status',key:'status',width:20 },
      //   { header:'Vehicle',key:'vehicle_type',width:20 },
      //   // { header:'First Name',key:'first_name',width:20 },
      //   // { header:'phone Number',key:'phone_number',width:20},
      //   // { header:'Width',key:'width',width:20 },
        
      // ];
      // workSheetofdroplocation.columns = [
      //   { header:'S.no',key:'s_no',width:5 },
      //   { header:'First Name',key:'first_name',width:15 },
      //   { header:'Last Name',key:'last_name',width:15 },
      //   { header:'Phone Number',key:'phone_number',width:15 },
      //   { header:'Email',key:'email',width:25 },
      //   { header:'Flat Name',key:'flat_name',width:20 },
      //   { header:'Area',key:'area',width:20 },
      //   { header:'City',key:'city',width:20 },
      //   { header:'State',key:'state',width:10 },
      //   { header:'Country',key:'country',width:10 },
      //   { header:'PinCode',key:'pincode',width:10 },
      // ];
      // workSheetpicklocation.columns=[
      //   { header:'S.no',key:'s_no',width:5 },
      //   { header:'First Name',key:'first_name',width:15 },
      //   { header:'Last Name',key:'last_name',width:15 },
      //   { header:'Phone Number',key:'phone_number',width:15 },
      //   { header:'Email',key:'email',width:25 },
      //   { header:'Flat Name',key:'flat_name',width:20 },
      //   { header:'Area',key:'area',width:20 },
      //   { header:'City',key:'city',width:20 },
      //   { header:'State',key:'state',width:10 },
      //   { header:'Country',key:'country',width:10 },
      //   { header:'PinCode',key:'pincode',width:10 },
      //   { header:'Parcel Value',key:'parcel_value',width:15 },
      //   { header:'Weight',key:'weight',width:10 },
      //   { header:'Dimensions',key:'dimensions',width:15 },
      //   { header:'Comment',key:'comment',width:25 },
      //   { header:'Pickup Time',key:'pickup_date_time',width:25 },

      // ];
      // workSheetoftransporterdetails.columns = [
      //   { header:'S.no',key:'s_no',width:5 },
      //   { header:'First Name',key:'first_name',width:15 },
      //   { header:'Last Name',key:'last_name',width:15 },
      //   { header:'Phone Number',key:'phone_number',width:15 },
      //   { header:'Email',key:'email',width:25 },
      //   { header:'GST Number',key:'gst_number',width:20 },
      //   { header:'Register Number',key:'register_number',width:20 },
      // ]

      let count = 1;
      // console.log(flatten(DD))  
      if(DD.length == 0 ){
        console.log("if")
        req.flash("error_msg", "There is no order found");
        return res.redirect("/order/list");     
      }else{
        console.log("else")
        let exceloutput = Date.now() + "output.xlsx"        
        let xls = json2xls(DDATA);

        fs.writeFileSync(exceloutput, xls, 'binary');
         res.download(exceloutput,(err) => {
          if(err){
              fs.unlinkSync(exceloutput)
              res.send("Unable to download the excel file")
          }
          fs.unlinkSync(exceloutput)
          // return res.render("Order/displayOrders", {
          //         orders: DD,
          // })
      })
      
    //     DD.forEach((order)=>{
    //       // console.log(order,"orderlist")
    //       order.s_no = count;
    //       order.orderData.s_no = count
    //       order.orderData.transporter_details.s_no = count
    //       order.orderData.pickup_location.s_no = count
    //       order.orderData.drop_location.s_no = count
    //       // workSheet.addRow(order.orderData);
    //       // workSheet.mergeCellsWithoutStyle(`C${count}:C${count+=1}`)  
    //       workSheet.addRow(order)
    //       workSheet.addRow(order.orderData);
    //       workSheetoftransporterdetails.addRow(order.orderData.transporter_details)
    //       workSheetofdroplocation.addRow(order.orderData.drop_location)
    //       workSheetpicklocation.addRow(order.orderData.pickup_location);
    //       count += 1;
    //     });
    //     workSheet.getColumn(4,5).alignment = {horizontal: 'center'}
    //     // workSheet.mergeCells('C2:C3')
    //     workSheet.getRow(1).eachCell((cell)=>{
    //       cell.font = {bold:true}
    //     });
    //     workSheetoftransporterdetails.getRow(1).eachCell((cell)=>{
    //       cell.font = {bold:true}
    //     });
    //     workSheetofdroplocation.getRow(1).eachCell((cell)=>{
    //       cell.font = {bold:true}
    //     });
    //     workSheetpicklocation.getRow(1).eachCell((cell)=>{
    //       cell.font = {bold:true}
    //     });
        
    // //     const dt = await workbook.xlsx.writeFile(`${path}/users.xlsx`)
    // //  .then(() => {
    // //    res.send({
    // //      status: "success",
    // //      message: "file successfully downloaded",
    // //      path: `${path}/users.xlsx`,
    // //     });
    // //  });
    //     const dt = await workbook.xlsx.writeFile("Detailse.xlsx")
    //       // res.send("done");
    //       return res.render("Order/displayOrders", {
    //           message: "file successfully downloaded",
    //           orders: DD,
    //       })
  
      }
      
      // console.log(DD,"??????????????????All ID ???????")
      // return res.render("Order/displayOrders", {
      //   orders: DD,
      // });
    } catch (error) {
      const errors = [];
      errors.push(error.message);
      return res.render("Order/displayOrders", {
        errors: errors,
      });
    }
  
}


exports.orderDetails = async (req, res) => {
  try {
    const id = req.params.order_id;
    let transporter, driver, customer, order, vehicle;

    const getOrderById = await db.collection("order_details").doc(id);
    const data = await getOrderById.get();
    if (data.data() == undefined) {
      req.flash("error_msg", "Order not found...!!");
      return res.redirect("/order/list");
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

//* TODO: if require  */

// exports.exportDetails = async (req,res) =>{
// // const id =  req.params
//   // console.log(id,"parameter");
// console.log( req.body,"requestBody")
// // let DD = [];
// // let oId = [];
//   // try {
//   //   const orders = [];
//   //   const data = await db.collection("order_details").get();
//   //   data.forEach((doc) => {
//   //     const order = { id: doc.id, orderData: doc.data() };
//   //     DD.push(order);
//   //   });
//   //   // DD.push(orders)
//   //   // console.log(DD,"filter order")
//   //   for(let i = 0; i<DD.length;i++){
//   //     oId.push(DD[i].id)
//   //   }
//   //   console.log(oId,"??????????????????All ID ???????")
//   //   // return res.render("Order/displayOrders", {
//   //   //   orders: orders,
//   //   // });
//   // } catch (error) {
//   //   const errors = [];
//   //   errors.push(error.message);
//   //   return res.render("Order/displayOrders", {
//   //     errors: errors,
//   //   });
//   // }
// }