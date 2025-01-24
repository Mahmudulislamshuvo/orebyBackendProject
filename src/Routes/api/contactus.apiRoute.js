const express = require("express");
const { createContactUs } = require("../../Controller/contactus.controller");
const _ = express.Router();

_.route("/contact").post(createContactUs);

module.exports = _;
