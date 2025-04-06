const express = require("express");
const {
  placeOrder,
  GetAllorders,
  SingleOrder,
  updateOrderStatus,
} = require("../../Controller/order.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/order").put(authGuard, placeOrder).get(GetAllorders);
_.route("/order/single/:id").get(SingleOrder);
_.route("/order/status/:id").put(updateOrderStatus);

module.exports = _;
