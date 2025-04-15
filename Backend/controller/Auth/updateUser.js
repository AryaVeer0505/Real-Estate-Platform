const User = require("../../models/User.model.js")
const editUser=async (req, res) => {
  const userId = req.params.id;
  const { username, number, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, number, email, role },
      { new: true}
    );
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
    console.log("User Data updated")
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
}

module.exports = editUser;
