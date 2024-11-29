const express = require("express");
const {
  createProduct,
  getAllproducts,
  updateProduct,
  getSingleProduct,
} = require("../../Controller/product.controller");
const _ = express.Router();
const { upload } = require("../../middleware/multer.middleware");

_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createProduct)
  .get(getAllproducts);

_.route("/product/:productId")
  .put(upload.fields([{ name: "image", maxCount: 5 }]), updateProduct)
  .get(getSingleProduct);

module.exports = _;
