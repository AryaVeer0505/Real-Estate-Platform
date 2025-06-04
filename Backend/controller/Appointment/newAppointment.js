const Appointment = require("../../models/appointment.model.js");
const Property = require("../../models/property.model.js");
const User = require("../../models/User.model.js");
const GoogleUser = require("../../models/google.models.js");

const newAppointment = async (req, res) => {
  const { propertyId, appointmentDate } = req.body;
  const userId = req.user?._id;
  
  // Determine user type based on authentication method
  const loggedUserType = req.user?.googleId ? "GoogleUser" : "User";

  try {
    // Validate required fields
    if (!propertyId || !appointmentDate || !userId) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: propertyId, appointmentDate, or user authentication" 
      });
    }

    // Get property with owner information
    const property = await Property.findById(propertyId)
      .select('ownerId ownerType title')
      .lean();
      
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: "Property not found." 
      });
    }

    // Enhanced owner check
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
        code: "OWNER_BOOKING_ATTEMPT",
        propertyTitle: property.title // Provide more context
      });
    }

    // Validate appointment date (ensure it's in the future)
    const now = new Date();
    const appointmentTime = new Date(appointmentDate);
    
    if (appointmentTime <= now) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future."
      });
    }

    // Check for existing appointment (same property + same day)
    const appointmentDayStart = new Date(appointmentDate);
    appointmentDayStart.setUTCHours(0, 0, 0, 0);

    const appointmentDayEnd = new Date(appointmentDayStart);
    appointmentDayEnd.setDate(appointmentDayStart.getDate() + 1);

    const existingAppointment = await Appointment.findOne({
      propertyId,
      userId,
      appointmentDate: {
        $gte: appointmentDayStart,
        $lt: appointmentDayEnd,
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment for this property on the selected date.",
        existingAppointmentId: existingAppointment._id
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      propertyId,
      userId,
      userType: loggedUserType,
      appointmentDate,
      status: 'pending',
      createdAt: new Date()
    });

    await appointment.save();

    // Get user details for response
    let user;
    if (loggedUserType === 'User') {
      user = await User.findById(userId).select('username email');
    } else {
      user = await GoogleUser.findById(userId).select('name email');
    }

    // Successful response
    res.status(201).json({ 
      success: true,
      message: "Appointment booked successfully.",
      appointment: {
        id: appointment._id,
        date: appointment.appointmentDate,
        status: appointment.status,
        property: {
          id: propertyId,
          title: property.title
        },
        user: {
          name: user?.username || user?.name || 'Unknown',
          email: user?.email || 'No email'
        }
      }
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error booking appointment.",
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

module.exports = newAppointment;