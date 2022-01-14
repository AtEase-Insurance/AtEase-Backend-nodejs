const Joi = require("joi");

// User SignUp
exports.signUp = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  });

  return schema.validate(user);
};

// User LogIn
exports.logIn = (user) => {
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
    password: Joi.string().max(255).required(),
  }).unknown();

  return schema.validate(user);
};

// Password Change
exports.passwordChange = (user) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).max(255).required(),
    newPassword: Joi.string().min(6).max(255).required(),
    confirmNewPassword: Joi.string().required().valid(Joi.ref("newPassword")),
  }).unknown();

  return schema.validate(user);
};
