const express = require("express");
const _ = express.Router();

const {
  Registration,
  OtpVerify,
  login,
} = require("../../Controller/auth.controller");

_.route("/auth/resgistration").post(Registration);
_.route("/auth/verify-otp").post(OtpVerify);
_.route("/auth/login").post(login);

module.exports = _;
