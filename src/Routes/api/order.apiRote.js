const express = require("express");
const { placeOrder } = require("../../Controller/order.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/order").put(authGuard, placeOrder);

module.exports = _;
