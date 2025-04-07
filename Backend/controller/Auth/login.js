const User = require("../../models/User.model"); 
const { loginValidation } = require("../../services/validation_schema"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
require('dotenv').config();

const login = async (req, res, next) => {
  try {
    const loginResponse = await loginValidation.validateAsync(req.body);
    const { email, password } = loginResponse;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log("Invalid login attempt: Email not found");
      return res.status(401).json({
        success: false,
        message: "Invalid Email Address. Please register.",
      });
    }
    const passwordMatching = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatching) {
      console.log("Invalid login attempt: Incorrect password");
      return res.status(401).json({
        success: false,
        message: "Incorrect Password. Please try again.",
      });
    }

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email
    };

    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const jwToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    console.log("User logged in successfully:", existingUser.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        username: existingUser.username,
        email: existingUser.email,
      },
      redirectTo: '/',
      jwToken
    });

  } catch (error) {
    console.error("Error during login:", error);
    next(error); 
  }
};

module.exports = login;
