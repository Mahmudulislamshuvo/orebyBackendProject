const express = require("express");
const _ = express.Router();
const {
  createBanner,
  getallBanner,
  getSinglebanner,
  deleteBanner,
  updateBanner,
} = require("../../Controller/banner.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/banner")
  .post(upload.fields([{ name: "image", maxCount: 5 }]), createBanner)
  .get(getallBanner);
_.route("/banner/:id")
  .get(getSinglebanner)
  .delete(deleteBanner)
  .put(upload.fields([{ name: "image", maxCount: 5 }]), updateBanner);

module.exports = _;
