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

// Validating user data
exports.validateAdminData = (data) => {
  let errors = [];
  if (isEmpty(data.firstname)) {
    errors.push("First name is required");
  }
  if (isEmpty(data.lastname)) {
    errors.push("Last name is required");
  }
  if (isEmpty(data.phone)) {
    errors.push("Phone is required");
  }
  if (isEmpty(data.email)) {
    errors.push("Email is required");
  }
  if (isEmpty(data.password)) {
    errors.push("Password is required");
  }

  if (data.phone.length !== 10) {
    errors.push("Phone number should be exact 10 digits");
  }
  if (data.password.length < 6) {
    errors.push("The password should be at least 6 character long");
  }
  if (!isNumeric(data.phone)) {
    errors.push("Phone number should be numbers only.");
  }

  return {
    errors,
    valid: errors.length === 0 ? true : false,
  };
};
