const Appointment = require("../../models/appointment.model.js");

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { appointmentDate, status } = req.body;

    if (!appointmentDate && !status) {
      return res.status(400).json({ success: false, message: "No update fields provided" });
    }

    const updateFields = {};
    if (appointmentDate) updateFields.appointmentDate = new Date(appointmentDate);
    if (status) updateFields.status = status;

    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId /* , userId: req.user._id */ },
      updateFields,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Appointment updated", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = updateAppointment;
