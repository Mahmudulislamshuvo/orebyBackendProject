const express = require("express");
const _ = express.Router();

const {
  Registration,
  OtpVerify,
  login,
  logout,
  resetPassword,
  resetEmail,
  setRecoveryEmail,
} = require("../../Controller/auth.controller");
const { authGuard } = require("../../middleware/authGuard.middle");

_.route("/auth/resgistration").post(Registration);
_.route("/auth/verify-otp").post(OtpVerify);
_.route("/auth/login").post(login);
_.route("/auth/logout").get(authGuard, logout);
_.route("/auth/reset-password").post(resetPassword);
_.route("/auth/reset-email").post(resetEmail);
_.route("/auth/set-recoveryemail").post(authGuard, setRecoveryEmail);

module.exports = _;
