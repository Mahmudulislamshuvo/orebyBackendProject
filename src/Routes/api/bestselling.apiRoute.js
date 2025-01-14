const express = require("express");
const {
  createBestselling,
  GetAllBestsellingProduct,
  UpdateBestSellingProduct,
  deleteBestSellingProduct,
} = require("../../Controller/bestselling.controller");

const _ = express.Router();

_.route("/bestselling").post(createBestselling).get(GetAllBestsellingProduct);
_.route("/bestselling/:id")
  .put(UpdateBestSellingProduct)
  .delete(deleteBestSellingProduct);

module.exports = _;
