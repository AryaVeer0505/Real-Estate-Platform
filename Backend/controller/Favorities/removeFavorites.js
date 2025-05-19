const Favorite = require('../../models/favorite.model'); 

const RemoveFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: 'User is not authenticated' });
    }

    const existingFavorite = await Favorite.findOne({ userId, propertyId });

    if (!existingFavorite) {
      return res.status(404).json({ message: 'Property is not in your favorites' });
    }

    await Favorite.findOneAndDelete({ userId, propertyId });

    return res.status(200).json({ message: 'Property removed from favorites' });

  } catch (error) {
    console.error('Error removing property from favorites:', error);
    return res.status(500).json({ message: 'An error occurred while removing the property from favorites' });
  }
};

module.exports = RemoveFromFavorites;
