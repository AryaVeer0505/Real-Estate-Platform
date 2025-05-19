const Cart = require("../../models/cart.model.js");
const Property = require("../../models/property.model.js");

// Helper function for error responses
const errorResponse = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message
  });
};

// Add property to cart
exports.addToCart = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user?.id;

  // Validate inputs
  if (!userId) {
    return errorResponse(res, 401, "User authentication required");
  }
  if (!propertyId) {
    return errorResponse(res, 400, "Property ID is required");
  }

  try {
    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return errorResponse(res, 404, "Property not found");
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        properties: [propertyId]
      });
    } else {
      // Check for duplicate
      if (cart.properties.some(id => id.toString() === propertyId)) {
        return errorResponse(res, 400, "Property already in cart");
      }
      cart.properties.push(propertyId);
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('properties');
    
    res.status(200).json({
      success: true,
      cart: populatedCart
    });

  } catch (err) {
    console.error("Add to cart error:", err);
    errorResponse(res, 500, "Server error");
  }
};

// Remove property from cart
exports.removeFromCart = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return errorResponse(res, 401, "User authentication required");
  }
  if (!propertyId) {
    return errorResponse(res, 400, "Property ID is required");
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, 404, "Cart not found");
    }

    const initialCount = cart.properties.length;
    cart.properties = cart.properties.filter(
      id => id.toString() !== propertyId
    );

    if (cart.properties.length === initialCount) {
      return errorResponse(res, 404, "Property not found in cart");
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('properties');
    
    res.status(200).json({
      success: true,
      cart: populatedCart
    });

  } catch (err) {
    console.error("Remove from cart error:", err);
    errorResponse(res, 500, "Server error");
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return errorResponse(res, 401, "User authentication required");
  }

  try {
    let cart = await Cart.findOne({ user: userId }).populate('properties');

    if (!cart) {
      // Return empty cart structure if none exists
      return res.status(200).json({
        success: true,
        cart: {
          user: userId,
          properties: []
        }
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (err) {
    console.error("Get cart error:", err);
    errorResponse(res, 500, "Server error");
  }
};