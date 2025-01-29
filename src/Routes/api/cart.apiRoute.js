const express = require("express");
const {
  AddtoCart,
  GetCartItemUser,
} = require("../../Controller/cart.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/addtocart").post(authGuard, AddtoCart);
_.route("/getuseritem").get(authGuard, GetCartItemUser);

module.exports = _;
