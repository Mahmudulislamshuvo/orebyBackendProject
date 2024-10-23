const express = require("express");
const app = express();
const AllRouter = require("./Routes/index");

// middleware
app.use(AllRouter);

module.exports = { app };
