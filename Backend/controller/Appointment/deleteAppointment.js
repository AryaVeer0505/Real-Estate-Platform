const Appointment = require("../../models/appointment.model.js");

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role; 

    let filter = { _id: appointmentId };

    if (userRole !== "admin") {
      filter.userId = userId;
    }

    const deletedAppointment = await Appointment.findOneAndDelete(filter);

    if (!deletedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = deleteAppointment;
