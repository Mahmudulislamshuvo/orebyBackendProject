const express = require("express");
const { AddtoCart } = require("../../Controller/cart.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/addtocart").post(authGuard, AddtoCart);

module.exports = _;
