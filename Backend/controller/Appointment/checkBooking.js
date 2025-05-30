const mongoose = require("mongoose");
const Appointment = require("../../models/appointment.model.js");

const checkBooking = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const propertyId = req.params.id;

    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const existing = await Appointment.findOne({ userId, propertyId });

    res.status(200).json({ booked: !!existing });
  } catch (error) {
    console.error("Error checking booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkBooking;
