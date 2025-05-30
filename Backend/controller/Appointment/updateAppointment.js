const Appointment = require("../../models/appointment.model.js");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { appointmentDate, status } = req.body;

    if (!appointmentDate && !status) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updateFields = {};

    if (appointmentDate) {
      const parsedDate = dayjs(appointmentDate).utc();

      if (!parsedDate.isValid()) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      if (parsedDate.isBefore(dayjs().utc())) {
        return res
          .status(400)
          .json({ message: "Appointment must be in the future" });
      }

      updateFields.appointmentDate = parsedDate.toDate();
    }

    if (status) {
      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      updateFields.status = status.toLowerCase();
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateFields,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateAppointment;
