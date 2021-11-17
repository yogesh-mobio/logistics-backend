/* validate password */
exports.validatePassword = () => {
  return {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
    custom: {
      options: (value) => {
        let regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regex.exec(value) == null) {
          throw new Error(
            "Password should be minimum eight characters, at least one letter,one Special Char and one number"
          );
        }
        return true;
      },
    },
  };
};

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
  password: this.validatePassword(),
};
