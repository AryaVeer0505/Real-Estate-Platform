const User = require("../../models/User.model");
const GoogleUser = require("../../models/google.models.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    const googleUsers = await GoogleUser.find().lean();

    const formattedGoogle = googleUsers.map((g) => ({
      ...g,
      username: g.name,
    }));

    const allUsers = [...users, ...formattedGoogle];

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = getAllUsers;
