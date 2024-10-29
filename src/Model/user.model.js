const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserModel = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name missing !!"],
      trime: true,
    },
    lastName: {
      type: String,
      trime: true,
    },
    email: {
      type: String,
      required: [true, "Email missing !!"],
      trime: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile Number missing !!"],
      trime: true,
      max: [11, "max length is 11"],
      min: [11, "min length is 11"],
    },
    address1: {
      type: String,
      required: [true, "address1 missing !!"],
      trime: true,
    },
    address2: {
      type: String,
      trime: true,
    },
    city: {
      type: String,
      trime: true,
    },
    postCode: {
      type: Number,
      trime: true,
    },
    divition: {
      type: String,
      trime: true,
    },
    districk: {
      type: String,
      trime: true,
    },
    password: {
      type: String,
      required: [true, "Password missing !!"],
      trime: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "merchent"],
      default: "user",
    },
    otp: {
      type: Number,
      trime: true,
    },
    resetOtp: {
      type: Number,
      trime: true,
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    Timestamp: true,
  }
);

module.exports = mongoose.model("user", UserModel);
