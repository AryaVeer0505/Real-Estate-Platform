const Favorite = require('../../models/favorite.model.js');
const Property = require('../../models/property.model.js');

const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ userId }).populate('propertyId');

    if (!favorites.length) {
      console.warn(`No favorites found for user ${userId}`);
      return res.status(404).json({ message: 'No favorites found for this user' });
    }

    const favoriteProperties = favorites.map(fav => fav.propertyId);

    return res.status(200).json({
      message: 'Favorites fetched successfully',
      count: favoriteProperties.length,
      favorites: favoriteProperties,
    });

  } catch (error) {
    console.error(`Error fetching favorites for user ${req.user._id}:`, error);
    return res.status(500).json({ message: 'An error occurred while fetching favorites' });
  }
};

module.exports = getFavorites;
