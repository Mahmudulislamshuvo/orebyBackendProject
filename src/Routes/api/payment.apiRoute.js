const express = require("express");
const {
  successPayment,
  failedPayment,
} = require("../../Controller/payment.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/success/:id").post(authGuard, successPayment);
_.route("/failed/:id").post(authGuard, failedPayment);

module.exports = _;
