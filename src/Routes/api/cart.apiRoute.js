const express = require("express");
const {
  AddtoCart,
  GetCartItemUser,
  incrementCartitem,
  decrementCartitem,
  deleteCartItem,
  userCart,
} = require("../../Controller/cart.controller");
const { authGuard } = require("../../middleware/authGuard.middle");
const _ = express.Router();

_.route("/addtocart").post(authGuard, AddtoCart);
_.route("/getuseritem").get(authGuard, GetCartItemUser);
_.route("/increment/:cartid").post(authGuard, incrementCartitem);
_.route("/decrement/:cartid").post(authGuard, decrementCartitem);
_.route("/deletecart/:cartid").delete(authGuard, deleteCartItem);
_.route("/usercart").get(authGuard, userCart);

module.exports = _;
