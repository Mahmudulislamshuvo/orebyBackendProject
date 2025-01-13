const express = require("express");
const {
  createFlashSale,
  GetAllFlashsaleProduct,
  UpdateFlashSaleProduct,
  deleteFlashSaleProduct,
} = require("../../Controller/flashsale.controller");

const _ = express.Router();

_.route("/flashsale").post(createFlashSale).get(GetAllFlashsaleProduct);
_.route("/flashsale/:id")
  .put(UpdateFlashSaleProduct)
  .delete(deleteFlashSaleProduct);

module.exports = _;
