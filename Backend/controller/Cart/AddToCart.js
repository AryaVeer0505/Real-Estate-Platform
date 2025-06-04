const Cart = require("../../models/cart.model");
const Property = require("../../models/property.model.js");

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { propertyId } = req.body;

    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({ message: "Property not found" });
    }

    const alreadyInCart = await Cart.findOne({ user: userId, property: propertyId });
    if (alreadyInCart) {
      return res.status(400).json({ message: "Property already in cart" });
    }

    const cartItem = new Cart({ user: userId, property: propertyId });
    await cartItem.save();

    return res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = addToCart;
