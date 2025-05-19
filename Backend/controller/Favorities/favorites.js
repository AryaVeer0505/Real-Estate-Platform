const Favorite = require('../../models/favorite.model.js');
const Property = require('../../models/property.model.js');

const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if userId is valid (in case checkAuth fails)
    if (!userId) {
      return res.status(400).json({ message: 'User is not authenticated' });
    }

    // Fetch the user's favorites and populate the associated property details
    const favorites = await Favorite.find({ userId }).populate('propertyId');

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }

    // Return the favorite properties
    res.status(200).json({
      favorites: favorites.map(fav => fav.propertyId), 
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'An error occurred while fetching favorites' });
  }
};

module.exports = getFavorites;
