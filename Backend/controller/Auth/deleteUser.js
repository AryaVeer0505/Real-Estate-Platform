const User=require("../../models/User.model")
const deleteUser=async(req,res)=>{
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" 
            ,user:deletedUser});
            console.log("User Deleted")
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
    exports.deleteUser=deleteUser