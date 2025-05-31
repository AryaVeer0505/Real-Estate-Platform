const fs = require("fs");
const path = require("path");
const Property = require("../../Models/property.model.js");

const deleteProperty = async (req, res) => {
  try {
    const property_id = req.params.id;

    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.images && Array.isArray(property.images)) {
      property.images.forEach((imageUrl) => {
        const fileName = imageUrl.split("/uploads/")[1];
        if (fileName) {
          const filePath = path.join(__dirname, "../../uploads", fileName);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting image: ${fileName}`, err.message);
            } else {
              console.log(`Deleted image: ${fileName}`);
            }
          });
        }
      });
    }

    const deletedProperty = await Property.findByIdAndDelete(property_id);

    res.status(200).json({
      success: true,
      message: "Property and associated images deleted",
      property: deletedProperty,
    });

    console.log("Property deleted");
  } catch (error) {
    console.log("Failed to delete", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

exports.deleteProperty = deleteProperty;
