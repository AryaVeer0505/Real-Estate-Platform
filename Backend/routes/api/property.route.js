const router = require('express').Router();

const addProperty = require('../../controller/Property/addProperty.js');
const fetchProperty = require('../../controller/Property/fetchProperties.js');
const { checkAuth } = require('../../middlewares/checkAuth.js');
const { deleteProperty } = require('../../controller/Property/deleteProperty.js');
const updateProperty = require('../../controller/Property/updateProperty.js');
const getPropertyByIds = require('../../controller/Property/getPropertyById');

const AddToFavorites = require('../../controller/Favorities/AddFavorites.js');
const RemoveFromFavorites = require('../../controller/Favorities/removeFavorites.js');
const getFavorites = require('../../controller/Favorities/favorites.js');

const {addToCart,removeFromCart,getCart} = require('../../controller/Cart/Cart.js');

router.post('/favorite', checkAuth, async (req, res) => {
  const { propertyId, action } = req.body;

  if (!propertyId || !action) {
    return res.status(400).json({ message: "propertyId and action are required." });
  }

  try {
    if (action === 'add') {
      await AddToFavorites(req, res);  
    } else if (action === 'remove') {
      await RemoveFromFavorites(req, res);  
    } else {
      return res.status(400).json({ message: "Invalid action specified. Use 'add' or 'remove'." });
    }
  } catch (error) {
    console.error('Error processing favorite action:', error);
    return res.status(500).json({ message: 'An error occurred while processing the favorite action' });
  }
});

router.get('/favorites', checkAuth, getFavorites);

router.post('/cart/add', checkAuth, addToCart);

router.post('/cart/remove', checkAuth, removeFromCart);

router.get('/cart', checkAuth, getCart);

router.post('/addProperty', checkAuth, addProperty);
router.get('/allProperties', checkAuth, fetchProperty);
router.delete('/deleteProperty/:id', checkAuth, deleteProperty);
router.put('/updateProperty/:id', checkAuth, updateProperty);
router.get('/:id', getPropertyByIds);

module.exports = router;
