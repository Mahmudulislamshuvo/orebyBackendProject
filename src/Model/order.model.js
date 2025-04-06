const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    cartItem: [
      {
        type: Types.ObjectId,
        ref: "product",
      },
    ],
    customerinfo: {
      address1: {
        type: String,
        required: true,
        trim: true,
      },
      address2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      division: {
        type: String,
        required: true,
        trim: true,
      },
      postCode: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    paymentinfo: {
      paymentMethod: {
        type: String,
        required: true,
        trim: true,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
    orderStatus: {
      type: String,
      trim: true,
      default: "pending",
      enum: ["pending", "cancel", "processing", "deliverd"],
    },
    subtotal: {
      type: Number,
    },
    totalitem: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("order", orderSchema);
