const Order = require("../../models/order.model");
const Property = require("../../models/property.model");

const ownerOrders = async (req, res) => {
  try {
    const ownerId = req.user._id;
  const ownedProperties = await Property.find({ ownerId: ownerId }).select("_id");
    const ownedPropertyIds = ownedProperties.map((p) => p._id);
    const orders = await Order.find({
      "properties.propertyId": { $in: ownedPropertyIds },
    })
      .populate("properties.propertyId", "title images price owner")
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    const flattened = [];
    orders.forEach((ord) => {
      ord.properties.forEach((propItem) => {
        if (ownedPropertyIds.some((id) => id.equals(propItem.propertyId._id))) {
          flattened.push({
            _id: ord._id + "_" + propItem.propertyId._id,
            orderId: ord._id,
            propertyId: propItem.propertyId, 
            buyer: ord.user, 
            price: propItem.price,
            quantity: propItem.quantity,
            createdAt: ord.createdAt,
          });
        }
      });
    });

    return res.status(200).json({ success: true, orders: flattened });
  } catch (error) {
    console.error("Error fetching owner orders:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = ownerOrders;
