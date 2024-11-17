const express = require("express");
const _ = express.Router();
const {
  subCategory,
  getAllsubCategory,
  SingleSubCategory,
  DeteleSingleSubCategory,
  updateSubCategory,
} = require("../../Controller/subCategory.controller");

_.route("/subcategory").post(subCategory).get(getAllsubCategory);
_.route("/subcategory/:id")
  .get(SingleSubCategory)
  .delete(DeteleSingleSubCategory)
  .patch(updateSubCategory);

module.exports = _;
