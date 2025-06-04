const Order = require("../../models/order.model.js");

const updateOrders = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ success: false, message: "paymentStatus is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = paymentStatus.toLowerCase(); 

    await order.save();

    res.status(200).json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = updateOrders;
