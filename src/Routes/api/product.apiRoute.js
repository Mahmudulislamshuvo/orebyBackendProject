const express = require("express");
const { createProduct } = require("../../Controller/product.controller");
const _ = express.Router();

_.route("/product").post(createProduct);

module.exports = _;
