const User = require("../../models/User.model");
const { loginValidation } = require("../../services/validation_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
    };

    const secretKey = process.env.ACCESS_TOKEN_SECRET || "fallbackSecretKey";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      payload,
      token,
    });

  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

module.exports = login;
