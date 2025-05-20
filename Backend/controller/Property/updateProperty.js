const fs = require("fs");
const path = require("path");
const Property = require('../../models/property.model.js');

const updateProperty = async (req, res) => {
  try {
    const property_id = req.params.id;
    const { title, location, price, type, description, amenities } = req.body;

    let images = req.body.images || [];

    // REMOVE this line so status doesn't auto-change
    // const status = "approved";

    if (req.files && req.files.length > 0) {
      const oldProperty = await Property.findById(property_id);
      if (oldProperty && oldProperty.images) {
        oldProperty.images.forEach((filename) => {
          const filePath = path.join(__dirname, "../../public/upload", filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      images = req.files.map((file) => file.filename);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      property_id,
      { title, location, price, type, images, description, amenities }, // status removed here
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      property: updatedProperty,
    });
    console.log("Successfully updated");
  } catch (error) {
    console.error("Failed to edit", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit",
    });
  }
};

module.exports = updateProperty;
