const Favorite = require('../../models/favorite.model.js');
const Property = require('../../models/property.model.js');

const AddToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required.' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const existingFavorite = await Favorite.findOne({ userId, propertyId });
    if (existingFavorite) {
      console.warn(`User ${userId} attempted to add already favorited property ${propertyId}`);
      return res.status(409).json({ message: 'This property is already in your favorites' });
    }

    const newFavorite = new Favorite({ userId, propertyId });
    await newFavorite.save();

    console.info(`User ${userId} added property ${propertyId} to favorites`);

    return res.status(201).json({ message: 'Property added to favorites' });

  } catch (error) {
    console.error(`Error adding property ${propertyId} to favorites for user ${userId}:`, error);
    return res.status(500).json({ message: 'An error occurred while adding the property to favorites' });
  }
};

module.exports = AddToFavorites;
