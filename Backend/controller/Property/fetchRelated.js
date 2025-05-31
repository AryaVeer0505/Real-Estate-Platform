const mongoose = require("mongoose");
const Property = require("../../Models/property.model.js");

const fetchRelatedProperties = async (req, res) => {
  try {
    const { type, location, excludeId } = req.query;

    if (!type || !location || !excludeId) {
      return res
        .status(400)
        .json({ message: "Type, location, and excludeId are required." });
    }

    const relatedProperties = await Property.find({
      _id: { $ne: new mongoose.Types.ObjectId(excludeId) },
      type: { $regex: new RegExp(`^${type}$`, "i") },
      location: { $regex: new RegExp(`^${location}$`, "i") },
    }).limit(6);

    res.status(200).json({ relatedProperties });
  } catch (error) {
    console.error("❌ Error fetching related properties:", error);
    res.status(500).json({ message: "Error fetching related properties." });
  }
};

module.exports = fetchRelatedProperties;
