const express = require("express");
const _ = express.Router();
const {
  createCategory,
  Allcategory,
  singlgCategory,
  updateCategory,
  deleteCategory,
} = require("../../Controller/category.controller.js");
const { upload } = require("../../middleware/multer.middleware.js");

_.route("/category")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createCategory)
  .get(Allcategory);
_.route("/category/:id")
  .get(singlgCategory)
  .put(upload.fields([{ name: "image", maxCount: 1 }]), updateCategory)
  .delete(deleteCategory);

module.exports = _;
