const Appointment = require("../../models/appointment.model.js");

const newAppointment = async (req, res) => {
  const { propertyId, appointmentDate } = req.body;
  const userId = req.user._id;  

  try {
    if (!propertyId || !appointmentDate) {
      return res.status(400).json({ message: "Property and appointment date are required." });
    }

    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);

    const existingAppointment = await Appointment.findOne({
      propertyId,
      userId,
      appointmentDate: {
        $gte: appointmentDay,
        $lt: new Date(appointmentDay.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "You have already booked an appointment for this property on the selected date.",
      });
    }

    const appointment = new Appointment({
      propertyId,
      userId,
      appointmentDate,
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Error booking appointment." });
  }
};

module.exports = newAppointment;
