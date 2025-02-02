const express = require("express");
const { successPayment } = require("../../Controller/payment.controller");
const _ = express.Router();

_.route("/success/:id").post(successPayment);

module.exports = _;
