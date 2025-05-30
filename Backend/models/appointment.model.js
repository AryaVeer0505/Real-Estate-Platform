const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType",
  },
  userType: {
    type: String,
    enum: ["User", "GoogleUser"],
  },

  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed","cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
