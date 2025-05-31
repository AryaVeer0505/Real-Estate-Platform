const Appointment = require("../../models/appointment.model.js");
const Property = require("../../models/property.model.js");
const User = require("../../models/User.model.js");
const GoogleUser = require("../../models/google.models.js");

const newAppointment = async (req, res) => {
  const { propertyId, appointmentDate } = req.body;
  const userId = req.user?._id;
  const loggedUserType = req.user?.userType || (req.user?.googleId ? "GoogleUser" : "User");

  try {

    if (!propertyId || !appointmentDate || !userId) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields." 
      });
    }

    const property = await Property.findById(propertyId)
      .select('ownerId ownerType')
      .lean();
      
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: "Property not found." 
      });
    }

const isOwner = (
  property.ownerId && 
  userId && 
  property.ownerId.toString() === userId.toString() && 
  property.ownerType === loggedUserType
);

if (isOwner) {
  return res.status(403).json({
    success: false,
    message: "Property owners cannot book appointments for their own properties.",
    code: "OWNER_BOOKING_ATTEMPT" 
  });
}

    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setUTCHours(0, 0, 0, 0);

    const nextDay = new Date(appointmentDay);
    nextDay.setDate(appointmentDay.getDate() + 1);

    const existingAppointment = await Appointment.findOne({
      propertyId,
      userId,
      appointmentDate: {
        $gte: appointmentDay,
        $lt: nextDay,
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment for this property on the selected date.",
      });
    }

    const appointment = new Appointment({
      propertyId,
      userId,
      appointmentDate,
      userType: loggedUserType,
      status: 'pending' 
    });

    await appointment.save();

    let user;
    if (loggedUserType === 'User') {
      user = await User.findById(userId).select('name email');
    } else {
      user = await GoogleUser.findById(userId).select('name email');
    }

    res.status(201).json({ 
      success: true,
      message: "Appointment booked successfully.",
      appointment: {
        id: appointment._id,
        date: appointmentDate,
        property: propertyId,
        user: {
          name: user?.name || 'Unknown',
          email: user?.email || 'No email'
        }
      }
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error booking appointment.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = newAppointment;