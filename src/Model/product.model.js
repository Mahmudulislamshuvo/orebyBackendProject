const mongoose = require("mongoose");
const { Schema } = mongoose;

const productModel = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  discount: {
    type: String,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    defult: 0,
    max: 5,
  },
  review: [
    {
      type: String,
      trim: true,
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "store",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("product", productModel);
