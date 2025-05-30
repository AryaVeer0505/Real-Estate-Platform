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
  email: Joi.string().email().required(),
  number: Joi.string().required(),
  password: Joi.string().min(3).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  role: Joi.string().valid('user', 'owner', 'admin').required()
});
const propertyValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  location: Joi.string().min(2).max(100).required(),
  price: Joi.number().positive().required(),
  type: Joi.string()
    .valid('apartment', 'villa', 'familyhouse', 'rooms', 'pg', 'flats', 'officespaces', 'plot')
    .required(),
  description: Joi.string().min(5).required(),
  images: Joi.array().items(Joi.string()).max(5),
   status: Joi.string().valid("Sold", "Not Sold", "Pending").optional(),
  amenities: Joi.array()
    .items(
      Joi.string().valid(
        'parking',
        'gym',
        'pool',
        'wifi',
        'security',
        'garden',
        'elevator',
        'ac',
        'laundry'
      )
    )
    .min(1)
    .required()
});




module.exports = { registrationValidation, loginValidation,addUservalidation,propertyValidation};
