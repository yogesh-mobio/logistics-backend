// for checking empty string or not
const isEmpty = (string) => {
  if (string === "" || string === undefined) {
    return true;
  } else {
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

// Validating Trasporter data
exports.validateTransporterData = (data) => {
  let errors = [];
  if (isEmpty(data.firstname)) {
    errors.push({ msg: "First name is required" });
  }
  if (isEmpty(data.lastname)) {
    errors.push({ msg: "Last name is required" });
  }
  if (isEmpty(data.phone)) {
    errors.push({ msg: "Phone is required" });
  }
  if (isEmpty(data.email)) {
    errors.push({ msg: "Email is required" });
  }

  // Address Validation
  if (isEmpty(data.address)) {
    errors.push({ msg: "address is required" });
  }
  if (isEmpty(data.area)) {
    errors.push({ msg: "area is required" });
  }
  if (isEmpty(data.city)) {
    errors.push({ msg: "city is required" });
  }
  if (isEmpty(data.pincode)) {
    errors.push({ msg: "pincode is required" });
  }
  if (isEmpty(data.state)) {
    errors.push({ msg: "state is required" });
  }
  if (isEmpty(data.country)) {
    errors.push({ msg: "country is required" });
  }
  if (data.pincode.length !== 6) {
    errors.push({ msg: "Pincode should be exact 6 digits long" });
  }
  if (data.phone.length !== 10) {
    errors.push({ msg: "Phone number should be exact 10 digits long" });
  }
  if (!isNumeric(data.pincode)) {
    errors.push({ msg: "Pincode should be numbers only." });
  }
  if (!isNumeric(data.phone)) {
    errors.push({ msg: "Phone number should be numbers only." });
  }
  if (data.gstNo) {
    if (data.gstNo.length !== 15) {
      errors.push({ msg: "GST number should be 15 characters long" });
    }
  }
  if (isEmpty(data.registered)) {
    errors.push({ msg: "Please select an option of registered" });
  }
  if (isEmpty(data.status)) {
    errors.push({ msg: "Please select an option of status" });
  }

  return {
    errors,
    valid: errors.length == 0 ? true : false,
  };
};
