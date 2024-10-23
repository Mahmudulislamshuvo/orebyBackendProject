const express = require("express");
const _ = express.Router();
const authRoute = require("./api/auth.ApiRoute.js");

const baseApi = process.env.BASE_API;

_.use(baseApi, authRoute);
_.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: "Your Route is Invalid",
    error: true,
  });
});

_.get("/shuvo", (req, res) => {
  console.log("hi dear");
});

module.exports = _;
