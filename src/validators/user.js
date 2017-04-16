const entityValidator = {
  'email': {
    notEmpty: true,
    isEmail:{
      errorMessage: "you must provide an email"
    }
  },
  'password':{
    notEmpty: true,
    matches: {
      options: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/]
    },
    errorMessage: "password must contain at least 8 characters with at least one lowercase, at least one uppercase and at least a number"
  },
  'first_name':{
    notEmpty: true,
  },
  'last_name':{
    notEmpty: true,
  },

}
const loginValidator = {
  'email': {
    notEmpty: true,
    isEmail:{
      errorMessage: "you must provide an email"
    }
  },
  'password':{
    notEmpty: true,
    matches: {
      options: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/]
    },
    errorMessage: "password must contain at least 8 characters with at least one lowercase, at least one uppercase and at least a number"
  }
}

export default {
  entityValidator,
  loginValidator
}
