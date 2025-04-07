const Joi=require("joi")

const registrationValidation=Joi.object({
    username:Joi.string().required(),
    number:Joi.number().required(),
    email:Joi.string().email().required(),
    password:Joi.string().required(),
    confirmPassword:Joi.string().required(),
})

const loginValidation=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required(),
})
module.exports={registrationValidation,loginValidation}
