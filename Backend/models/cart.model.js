
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);