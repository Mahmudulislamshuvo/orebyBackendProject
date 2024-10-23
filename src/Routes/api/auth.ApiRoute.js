const express = require("express");
const _ = express.Router();

_.get("/resgistration", (req, res) => {
  console.log("registar here");
});

module.exports = _;
