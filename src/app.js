const express = require("express");
const app = express();
const AllRouter = require("./Routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("Public/temp"));
app.use(AllRouter);

module.exports = { app };
