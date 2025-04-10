const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

const invoiceSchema = new Schema(
  {
    subtotal: {
      type: Number,
      required: true,
    },
    customerDetails: {
      type: Object,
      required: true,
    },
    order: {
      type: Types.ObjectId,
      ref: "order",
    },
    tranId: {
      type: String,
      unique: true,
      trim: true,
    },
    valId: {
      type: String,
      trim: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "cancel", "processing", "delivered"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "cancel"],
      default: "pending",
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("invoice", invoiceSchema);
