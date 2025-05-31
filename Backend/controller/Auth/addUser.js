const User = require("../../models/User.model");
const { addUservalidation } = require("../../services/validation_schema");
const sendEmailForAddUser = require("../../services/sendEmailForAddUser");
const bcrypt = require("bcryptjs");

const addUser = async (req, res) => {
  try {
    // Validate with custom messages
    const { error, value } = addUservalidation.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(d => d.message)
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [
        { email: value.email },
        { username: value.username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === value.email 
          ? "Email already in use" 
          : "Username already taken"
      });
    }

    // Create user
    const user = new User({
      username: value.username,
      email: value.email,
      number: value.number,
      password: await bcrypt.hash(value.password, 10),
      role: value.role
    });

    await user.save();

    // Send email - make sure this is AFTER user is saved
    try {
      await sendEmailForAddUser(value.email, value.username);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the whole request if email fails
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
module.exports = addUser;
