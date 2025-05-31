const Cart = require("../../models/Cart.model.js");
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ user: userId }).populate("property");

    return res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getCart;
