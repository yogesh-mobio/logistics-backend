// for checking empty string or not
const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  }
  {
    return false;
  }
};

// for checking input value is numeric or not
const isNumeric = (string) => {
  var numbers = /^[0-9]+$/;
  if (string.match(numbers)) {
    return true;
  } else {
    return false;
  }
};

// Validating vehicle data
exports.validateVehicleData = (data) => {
  let errors = [];
  if (isEmpty(data.name)) {
    errors.push({ msg: "Vehicle name is required" });
  }
  if (isEmpty(data.capacity)) {
    errors.push({ msg: "Vehicle capacity is required" });
  }
  if (isEmpty(data.vehicleLength)) {
    errors.push({ msg: "Vehicle's length is required" });
  }
  if (isEmpty(data.vehicleWidth)) {
    errors.push({ msg: "Vehicle's width is required" });
  }
  if (isEmpty(data.vehicleHeight)) {
    errors.push({ msg: "Vehicle's height is required" });
  }
  // if (isEmpty(data.price100)) {
  //   errors.push({ msg: "Price for 0 to 100 km is required" });
  // }
  // if (isEmpty(data.price200)) {
  //   errors.push({ msg: "Price for 100 to 200 km is required" });
  // }
  // if (isEmpty(data.price300)) {
  //   errors.push({ msg: "Price for 200 to 300 km is required" });
  // }
  // if (isEmpty(data.price400)) {
  //   errors.push({ msg: "Price for 300 to 400 km is required" });
  // }
  // if (isEmpty(data.price500)) {
  //   errors.push({ msg: "Price for 400 to 500 km is required" });
  // }
  // if (isEmpty(data.price500Plus)) {
  //   errors.push({ msg: "Price for above 500 km is required" });
  // }

  // ---------------------------------------------------------------------

  if (!isNumeric(data.capacity)) {
    errors.push({ msg: "Capacity should be numbers only..!" });
  }
  if (!isNumeric(data.vehicleLength)) {
    errors.push({ msg: "Vehicle's length should be numbers only..!" });
  }
  if (!isNumeric(data.vehicleWidth)) {
    errors.push({ msg: "Vehicle's width should be numbers only..!" });
  }
  if (!isNumeric(data.vehicleHeight)) {
    errors.push({ msg: "Vehicle's height should be numbers only..!" });
  }
  // if (!isNumeric(data.price100)) {
  //   errors.push({ msg: "Price for 0 to 100 km should be numbers only..!" });
  // }
  // if (!isNumeric(data.price200)) {
  //   errors.push({ msg: "Price for 100 to 200 km should be numbers only..!" });
  // }
  // if (!isNumeric(data.price300)) {
  //   errors.push({ msg: "Price for 200 to 300 km should be numbers only..!" });
  // }
  // if (!isNumeric(data.price400)) {
  //   errors.push({ msg: "Price for 300 to 400 km should be numbers only..!" });
  // }
  // if (!isNumeric(data.price500)) {
  //   errors.push({ msg: "Price for 400 to 500 km should be numbers only..!" });
  // }
  // if (!isNumeric(data.price500Plus)) {
  //   errors.push({ msg: "Price for above 500 km should be numbers only..!" });
  // }

  return {
    errors,
    valid: errors.length === 0 ? true : false,
  };
};
