const User = require("../../Models/User.model.js");
const GoogleUser = require("../../Models/google.models.js");

const editUser = async (req, res) => {
  const userId = req.params.id;
  const { username, number, email, role } = req.body;

  try {
    const googleUser = await GoogleUser.findById(userId);
    if (googleUser) {
      return res
        .status(403)
        .json({ message: "Cannot update Google authenticated user" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, number, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });

    console.log("User Data updated");
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports = editUser;
