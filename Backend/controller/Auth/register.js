const User = require("../../models/User.model");
const { registrationValidation } = require("../../services/validation_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res, next) => {
  try {
   
    const registerValues = await registrationValidation.validateAsync(req.body);
    console.log("Registration data validated");

    const { username, number, email, password, confirmPassword, role } = registerValues;

    const existingUser = await User.findOne({
      $or: [{ email }, { number }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "User with this email is already registered",
        });
      }
      if (existingUser.number === number) {
        return res.status(400).json({
          success: false,
          message: "User with this number is already registered",
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      number,
      email,
      password: hashedPassword,
      role, 
    });

    await newUser.save();
    console.log("User registered successfully");

   
    const payload = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    const secretKey = process.env.ACCESS_TOKEN_SECRET || "fallbackSecretKey";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      payload,
      token, 
    });

  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
};

module.exports = register;
