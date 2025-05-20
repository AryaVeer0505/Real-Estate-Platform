const router = require("express").Router();
const {checkAuth} = require("../../middlewares/checkAuth.js");
const addToCart = require('../../controller/Cart/AddToCart.js');
const removeFromCart = require('../../controller/Cart/RemoveFromCart.js');
const getCart = require('../../controller/Cart/Cart.js');

router.post('/add', checkAuth, addToCart);

router.post('/remove', checkAuth, removeFromCart);

router.get('/get', checkAuth, getCart);

module.exports = router;