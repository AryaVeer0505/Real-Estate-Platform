const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: Number,
      required: function () {
        return this.listingType === "Buy";
      },
    },

    type: {
      type: String,
      enum: [
        "apartment",
        "villa",
        "familyhouse",
        "rooms",
        "pg",
        "flats",
        "officespaces",
        "plot",
      ],
      required: [true, "Property type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: ["Sold", "Not Sold", "Pending"],
      default: "Pending",
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      enum: [
        "parking",
        "gym",
        "pool",
        "wifi",
        "security",
        "garden",
        "elevator",
        "ac",
        "laundry",
        "water purifier",
        "geyser",
        "refrigerator",
        "cooler",
        "fan",
        "beds",
      ],
      default: [],
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "ownerType",
    },
    ownerType: {
      type: String,
      enum: ["User", "GoogleUser"],
    },
    listingType: {
      type: String,
      enum: ["Buy", "Rent"],
      required: true,
    },
    rentAmount: {
      type: Number,
      required: function () {
        return this.listingType === "Rent";
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Property", propertySchema, "properties");
