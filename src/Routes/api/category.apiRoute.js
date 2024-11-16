const express = require("express");
const _ = express.Router();
const {
  createCategory,
  Allcategory,
  singlgCategory,
  updateCategory,
} = require("../../Controller/category.controller.js");

_.route("/category").post(createCategory).get(Allcategory);
_.route("/category/:id").get(singlgCategory).patch(updateCategory);

module.exports = _;
