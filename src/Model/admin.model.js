const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
