const express = require("express");
const _ = express.Router();
const { subCategory } = require("../../Controller/subCategory.controller");

_.route("/subcategory").post(subCategory);

module.exports = _;
