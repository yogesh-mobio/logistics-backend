exports.signUp = {
  first_name: {
    notEmpty: true,
    errorMessage: "First Name cannot be empty",
  },
  last_name: {
    notEmpty: true,
    errorMessage: "Last Name cannot be empty",
  },
  phone_number: {
    notEmpty: true,
    errorMessage: "Please Enter Valid Phone Number With Min 10 Digits",
    isLength: {
      options: { min: 10, max: 15 },
    },
  },
};
