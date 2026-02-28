const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "paused", "sold", "rented", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Property", propertySchema)
