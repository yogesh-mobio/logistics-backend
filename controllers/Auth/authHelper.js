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
  let errors = [];
  if (isEmpty(data.email)) {
    errors.push({ msg: "Email is required." });
  }
  if (isEmpty(data.password)) {
    errors.push({ msg: "Password is required" });
  }

  return {
    errors,
    valid: errors.length === 0 ? true : false,
  };
};
