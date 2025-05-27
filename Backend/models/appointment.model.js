const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
    status: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
