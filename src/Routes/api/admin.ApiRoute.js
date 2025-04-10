const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard.middle");
const {
  createAdmin,
  adminLogin,
} = require("../../Controller/admin.controller");

_.route("/admin/create").post(createAdmin);
_.route("/admin/login").post(adminLogin);

module.exports = _;
