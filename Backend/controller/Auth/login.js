require("dotenv").config();
const User = require('../../models/User.model.js')
const { loginValidation } = require("../../services/validation_schema.js");
const bcrypt = require("bcrypt");
const {generateToken}=require("../../middlewares/checkAuth.js")

// const userTypeMap = {
//   user: "User",
//   owner: "User", // Same model
//   admin: "User", // Or separate model if you have one
// };


const login = async (req, res, next) => {
  try {
    const loginResponse = await loginValidation.validateAsync(req.body);
    const { email, password, role } = loginResponse;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email Address. Please register.",
      });
    }

    const passwordMatching = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatching) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password. Please try again.",
      });
    }

    if (existingUser.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${role}`,
      });
    }

  // const userType = userTypeMap[existingUser.role] || "User";

    const payload = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
      // userType,  
    };


    const secretKey=process.env.ACCESS_SECRET_KEY
    const token = generateToken(payload,secretKey);
   return res.status(200).json({
  success: true,
  message: "Login successful",
  payload: { 
    _id: existingUser._id,  
    username: existingUser.username, 
    email: existingUser.email,
    role: existingUser.role
  },
  token: token,
});


  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

module.exports = login;
