const mongoose = require("mongoose");
const User = require("../../models/User.model.js");
const GoogleUser = require("../../models/google.models.js");

const getUserById = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  try {
    let user;

    if (type === "google") {
      // Try both ObjectId and googleId string
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await GoogleUser.findById(id).lean();
      }
      if (!user) {
        user = await GoogleUser.findOne({ googleId: id }).lean();
      }

      if (user) {
        user.username = user.name;
        user.profilePicture = user.image || null;
        user.phone = "Not provided";
        user.userType = "GoogleUser";
      }
    } else {
      user = await User.findById(id).lean();
      if (user) {
        user.profilePicture = null;
        user.phone = user.number || "Not provided";
        user.userType = "User";
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getUserById;
