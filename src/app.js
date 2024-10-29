const express = require("express");
const app = express();
const AllRouter = require("./Routes/index");

// middleware
app.use(express.json()); //if I set it down of AllRouter it will not gong to work
app.use(AllRouter);

module.exports = { app };
