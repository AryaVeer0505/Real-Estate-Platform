const Joi = require("joi");

const registrationValidation = Joi.object({
  username: Joi.string().required(),
  number: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  role: Joi.string().valid("user", "owner","admin").required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("user", "owner","admin").required(), 
});

const addUservalidation = Joi.object({
  username: Joi.string().required(),
  number: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword:Joi.string().required(),
    role: Joi.string().valid('user', 'owner',"admin").required(),
})

module.exports = { registrationValidation, loginValidation,addUservalidation };
