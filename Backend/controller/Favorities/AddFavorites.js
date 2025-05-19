const Favorite = require('../../models/favorite.model.js');
const Property = require('../../models/property.model.js');

const AddToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required.' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const existingFavorite = await Favorite.findOne({ userId, propertyId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'This property is already in your favorites' });
    }

    const newFavorite = new Favorite({
      userId,
      propertyId
    });

    await newFavorite.save();

    return res.status(200).json({ message: 'Property added to favorites' });
    
  } catch (error) {
    console.error('Error adding property to favorites:', error);
    return res.status(500).json({ message: 'An error occurred while adding the property to favorites' });
  }
};

module.exports = AddToFavorites;
