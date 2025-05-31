const User = require("../../Models/User.model.js");
const GoogleUser = require("../../Models/google.models.js");
const Appointment=require("../../Models/appointment.model.js")
const Property = require("../../Models/property.model.js");

const appointmentsForOwner = async (req, res) => {
  try {
    console.log("appointmentsForOwner API hit");

    const ownerId = req.user._id;
    const ownerProperties = await Property.find({ ownerId: ownerId }).select("_id");
    const propertyIds = ownerProperties.map((property) => property._id);

    const appointments = await Appointment.find({ propertyId: { $in: propertyIds } })
      .populate("propertyId", "title");

    const enrichedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        let user = await User.findById(appointment.userId).select("username email number");
        if (!user) {
          user = await GoogleUser.findById(appointment.userId).select("name email image");
        }

        return {
          ...appointment.toObject(),
          userInfo: user,
        };
      })
    );

    res.status(200).json({ success: true, appointments: enrichedAppointments });
  } catch (error) {
    console.error("Error fetching appointments for owner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports=appointmentsForOwner