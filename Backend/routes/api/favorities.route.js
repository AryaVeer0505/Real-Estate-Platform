const router = require("express").Router();
const AddToFavorites = require('../../controller/Favorities/AddFavorites.js');
const RemoveFromFavorites = require('../../controller/Favorities/removeFavorites.js');
const getFavorites = require('../../controller/Favorities/favorites.js');
const {checkAuth} = require('../../middlewares/checkAuth.js');
const validateFavoriteAction = (req, res, next) => {
  const propertyId = req.body.propertyId || req.params.propertyId;

  if (!propertyId) {
    return res.status(400).json({ message: "propertyId is required." });
  }

  next();
};


router.post('/favorites/add', checkAuth, validateFavoriteAction, AddToFavorites);

router.delete('/favorites/remove/:propertyId', checkAuth, validateFavoriteAction, RemoveFromFavorites);

router.get('/favorites', checkAuth, getFavorites);

module.exports = router;
