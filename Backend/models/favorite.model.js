const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property', 
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

module.exports = model('Favorite', favoriteSchema, 'favorites');
