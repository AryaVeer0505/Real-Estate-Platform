// controller/Cart/RemoveFromCart.js
const Cart = require("../../Models/Cart.model");

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { propertyId } = req.body;

    const result = await Cart.findOneAndDelete({ user: userId, property: propertyId });

    if (!result) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    return res.status(200).json({ message: "Removed from cart" });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = removeFromCart;
