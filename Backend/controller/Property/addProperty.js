const Property = require("../../models/property.model.js");
const { propertyValidation } = require("../../services/validation_schema.js");

const property = async (req, res, next) => {
  try {
    const propertyData = await propertyValidation.validateAsync(req.body);
    const { title, location, price, type, description, images, amenities,status } =
      propertyData;
    const ownerId = req.user._id;

    const normalizedType = type.toLowerCase();

    const existingProperty = await Property.findOne({
      title,
      location,
      type: normalizedType,
      price,
    });

    if (existingProperty) {
      return res.status(400).json({
        success: false,
        message: "Please add a new property, this property is already listed",
      });
    }
   console.log("Logged in user ID:", req.user?._id);

    const newProperty = new Property({
      title,
      location,
      price,
      type: normalizedType,
      description,
      images,
      amenities,
      status:status || "Pending",
      ownerId: req.user._id,
      ownerType: req.user.googleId ?'GoogleUser' : 'User',
    });

    await newProperty.save();

    console.log("Property added successfully");

    res.status(200).json({
      success: true,
      message: "Property added",
      property: newProperty,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = property;
