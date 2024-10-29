const express = require("express");
const _ = express.Router();
const { Registration } = require("../../Controller/auth.controller");

_.route("/auth/resgistration").post(Registration);

module.exports = _;
