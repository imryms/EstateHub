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
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    propertyImage: {
      type: Image,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Property", propertySchema)
