const express = require("express");
const {
  placeOrder,
  GetAllorders,
} = require("../../Controller/order.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/order").put(authGuard, placeOrder).get(authGuard, GetAllorders);

module.exports = _;
