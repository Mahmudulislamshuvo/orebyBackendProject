const express = require("express");
const {
  createProduct,
  getAllproducts,
} = require("../../Controller/product.controller");
const _ = express.Router();
const { upload } = require("../../middleware/multer.middleware");

_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createProduct)
  .get(getAllproducts);

module.exports = _;
