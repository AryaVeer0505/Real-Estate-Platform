const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/order.model.js");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty or invalid." });
    }

    const line_items = cart.map((item) => {
      const imageUrl = item.image && item.image.startsWith("http")
        ? item.image
        : item.image
          ? `${process.env.CLIENT_URL}${item.image}`
          : "https://example.com/default-product-image.png";

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            images: [imageUrl],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity || 1,
      };
    });

    const totalAmount = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:5173/myOrders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cart`,
    });
    const orderProperties = cart.map(item => ({
      propertyId: item.propertyId,
      title: item.title,
      quantity: item.quantity || 1,
      price: item.price,      
      image: item.image,
    }));

    const order = new Order({
      user: userId,
      properties: orderProperties,    
      totalAmount: totalAmount,        
      paymentStatus: 'pending',
      paymentIntentId: session.payment_intent || null,
    });

    await order.save();

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

module.exports = placeOrder;
