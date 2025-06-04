const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  properties: [   
    {
      propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property',  
        required: true 
      },
      title: { type: String, required: true },
      quantity: { type: Number, default: 1 },  
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentIntentId: { type: String },  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
