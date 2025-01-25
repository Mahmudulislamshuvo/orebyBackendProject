const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartModel = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  subtotal: {
    type: Number,
  },
  size: {
    type: String,
    enum: ["S", "M", "L", "XL", "XXL"],
    default: "S",
  },
  color: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("cart", cartModel);
