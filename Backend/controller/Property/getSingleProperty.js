const Property = require('../../models/property.model.js');

const getSingleProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner');
     console.log('Property fetched from DB:', property); 

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ property });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = getSingleProperty;
