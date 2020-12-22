// for checking empty string or not
const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

// for validating signin data
exports.validateSignInData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = "Email is required.";
  } else if (isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
