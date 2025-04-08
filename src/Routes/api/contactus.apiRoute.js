const express = require("express");
const {
  createContactUs,
  getAllContactUsEmails,
} = require("../../Controller/contactus.controller");
const _ = express.Router();

_.route("/contact").post(createContactUs).get(getAllContactUsEmails);

module.exports = _;
