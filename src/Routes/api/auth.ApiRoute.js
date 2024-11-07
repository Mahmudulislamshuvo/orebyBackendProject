const express = require("express");
const _ = express.Router();
const { Registration, OtpVerify } = require("../../Controller/auth.controller");

_.route("/auth/resgistration").post(Registration);
_.route("/auth/verify-otp").post(OtpVerify);

module.exports = _;
