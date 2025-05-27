const Appointment = require("../../models/appointment.model.js");

const checkBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const propertyId = req.params.id;

    const existing = await Appointment.findOne({
      userId: userId,
      propertyId: propertyId,
    });

    res.status(200).json({ booked: !!existing });
  } catch (error) {
    console.error("Error checking booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkBooking;
