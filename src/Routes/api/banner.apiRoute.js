const express = require("express");
const _ = express.Router();
const {
  createBanner,
  getallBanner,
} = require("../../Controller/banner.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/banner")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createBanner)
  .get(getallBanner);

module.exports = _;
