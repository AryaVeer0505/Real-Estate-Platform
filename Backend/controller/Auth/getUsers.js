const User = require("../../models/User.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(400).json({ message: "Error fetching users" });
  }
};

module.exports = getAllUsers;
