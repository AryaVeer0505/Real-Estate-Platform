const fs = require("fs");
const path = require("path");
const Property = require('../../models/property.model.js');

const updateProperty = async (req, res) => {
  try {
    const property_id = req.params.id;
    const {
      title,
      location,
      price,
      type,
      description,
      amenities,
      status,
      listingType,
      rentAmount,
    } = req.body;

    let images = req.body.images || [];

    if (req.files && req.files.length > 0) {
      const oldProperty = await Property.findById(property_id);
      if (oldProperty && oldProperty.images) {
        oldProperty.images.forEach((filename) => {
          const filePath = path.join(__dirname, "../../public/upload", path.basename(filename));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      images = req.files.map((file) => file.filename);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      property_id,
      {
        title,
        location,
        price,
        type,
        images,
        description,
        amenities,
        status,
        listingType,
        rentAmount,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Failed to edit", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit",
      error: error.message,
    });
  }
};

module.exports = updateProperty;
