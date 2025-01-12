const express = require("express");
const { createFlashSale } = require("../../Controller/flashsale.controller");

const _ = express.Router();

_.route("/flashsale").post(createFlashSale);

module.exports = _;
