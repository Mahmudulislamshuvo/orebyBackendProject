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
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  review: [
    {
      type: Number,
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
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "subcategory",
  },
});

module.exports = mongoose.model("product", productModel);
