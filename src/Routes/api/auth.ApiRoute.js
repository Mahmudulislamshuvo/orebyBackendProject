const express = require("express");
const _ = express.Router();
const { Registration } = require("../../Controller/auth.controller");

_.route("/resgistration").get(Registration);

module.exports = _;
