const mongoose = require('mongoose');
const Property = require('../../Models/property.model.js');

const getSingleProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }

    const property = await Property.findById(id).populate('ownerId');
    console.log('Property fetched from DB:', property);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error('Error in getSingleProperty:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = getSingleProperty;
