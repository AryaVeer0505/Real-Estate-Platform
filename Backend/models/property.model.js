const { Schema, model } = require('mongoose');

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    type: {
      type: String,
      enum: ['apartment', 'villa', 'familyhouse', 'rooms', 'pg', 'flats', 'officespaces', 'plot'],
      required: [true, 'Property type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['Sold', 'Not Sold', 'Pending'],
      default: 'Not Sold',
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      enum: ['parking', 'gym', 'pool', 'wifi', 'security', 'garden', 'elevator', 'ac', 'laundry'],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Property', propertySchema, 'properties');
