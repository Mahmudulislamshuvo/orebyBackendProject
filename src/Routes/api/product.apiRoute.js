const express = require("express");
const {
  createProduct,
  getAllproducts,
  updateProduct,
} = require("../../Controller/product.controller");
const _ = express.Router();
const { upload } = require("../../middleware/multer.middleware");

_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createProduct)
  .get(getAllproducts)
  .patch(updateProduct);

module.exports = _;
