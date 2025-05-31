const Favorite = require('../../Models/favorite.model'); 

const RemoveFromFavorites = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;  // <-- change here
    const userId = req.user._id;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required.' });
    }

    const deletedFavorite = await Favorite.findOneAndDelete({ userId, propertyId });

    if (!deletedFavorite) {
      console.warn(`User ${userId} attempted to remove non-existent favorite ${propertyId}`);
      return res.status(404).json({ message: 'Property is not in your favorites' });
    }

    console.info(`User ${userId} removed property ${propertyId} from favorites`);

    return res.status(200).json({ message: 'Property removed from favorites' });

  } catch (error) {
    console.error(`Error removing property ${propertyId} from favorites for user ${userId}:`, error);
    return res.status(500).json({ message: 'An error occurred while removing the property from favorites' });
  }

};

module.exports = RemoveFromFavorites;
