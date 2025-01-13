const express = require("express");
const _ = express.Router();
const {
  createCategory,
  Allcategory,
  singlgCategory,
  updateCategory,
} = require("../../Controller/category.controller.js");
const { upload } = require("../../middleware/multer.middleware.js");

_.route("/category")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createCategory)
  .get(Allcategory);
_.route("/category/:id").get(singlgCategory).patch(updateCategory);

module.exports = _;
