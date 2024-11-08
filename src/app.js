const express = require("express");
const app = express();
const AllRouter = require("./Routes/index");
const cookieParser = require("cookie-parser");

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(AllRouter);

module.exports = { app };
