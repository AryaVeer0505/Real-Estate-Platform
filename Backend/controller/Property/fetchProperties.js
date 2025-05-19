const Property = require("../../models/property.model");

const fetchProperties = async (req, res) => {
  try {
    const properties = await Property.find(); 
    if (properties.length > 0) {
      res.status(200).json({ success: true, properties });
    } else {
      res.status(200).json({ success: false, message: "No properties found" });
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(400).json({ success: false, message: "Error fetching Properties" });
  }
};

module.exports = fetchProperties;
