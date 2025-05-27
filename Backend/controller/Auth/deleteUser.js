const User = require("../../models/User.model.js");
const GoogleUser = require("../../models/google.models.js");

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await GoogleUser.findByIdAndDelete(userId);
 
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { deleteUser };
