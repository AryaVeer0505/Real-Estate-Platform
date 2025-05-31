const Appointment = require("../../Models/appointment.model.js");
const User = require("../../Models/User.model.js");
const GoogleUser = require("../../Models/google.models.js");
const Property = require("../../Models/property.model.js");

const allAppointments = async (req, res) => {
  try {
    console.log("allAppointments API hit");

    const appointments = await Appointment.find()
      .populate("propertyId", "title location")
      .sort({ appointmentDate: -1 });

    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        let user = await User.findById(appointment.userId).select("username email number");

        if (!user) {
          user = await GoogleUser.findById(appointment.userId).select("name email image");
        }

        return {
          _id: appointment._id,
          username: user?.username || user?.name || "N/A",
          email: user?.email || "N/A",
          number: user?.number || "N/A",
          title: appointment.propertyId?.title || "N/A",
          location: appointment.propertyId?.location || "N/A",
          appointmentDate: appointment.appointmentDate,
          status: appointment.status,
        };
      })
    );

    res.status(200).json({
      success: true,
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

module.exports = allAppointments;
