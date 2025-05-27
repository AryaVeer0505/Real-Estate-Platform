const Appointment = require("../../models/appointment.model.js");

const myBooking = async (req, res) => {
  try {
    console.log("myBooking API hit");
    console.log("req.user:", req.user);

    const userId = req.user._id;

    const bookings = await Appointment.find({ userId: userId }).populate("propertyId");
    console.log("Found bookings:", bookings);

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = myBooking;
