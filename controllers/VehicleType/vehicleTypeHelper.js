// for checking empty string or not
const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  }
  {
    return false;
  }
};

const isEmptyArray = (ary) => {
  for (let i = 0; i <= ary.length; i++) {
    if (ary[i] === "") {
      return true;
    }
  }
  return false;
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

// const isNumeric = (string) => {
//   var numbers = /^[0-9]+$/;
//   if (string.match(numbers)) {
//     return true;
//   } else {
//     return false;
//   }
// };

// Validating vehicle data
exports.validateVehicleTypeData = (data) => {
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
  if (
    typeof data.kmFrom === "string" &&
    typeof data.kmTo === "string" &&
    typeof data.price === "string"
  ) {
    if (isEmpty(data.kmFrom)) {
      errors.push({ msg: "Please enter Starting kilometers." });
    }
    if (isEmpty(data.kmTo)) {
      errors.push({ msg: "Please enter Ending kilometers." });
    }
    if (isEmpty(data.price)) {
      errors.push({ msg: "Please enter price" });
    }
  } else {
    if (isEmptyArray(data.kmFrom)) {
      errors.push({ msg: "Please enter Starting kilometers." });
    }
    if (isEmptyArray(data.kmTo)) {
      errors.push({ msg: "Please enter Ending kilometers." });
    }
    if (isEmptyArray(data.price)) {
      errors.push({ msg: "Please enter price" });
    }
  }

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

  return {
    errors,
    valid: errors.length === 0 ? true : false,
  };
};
