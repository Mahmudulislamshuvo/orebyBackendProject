const express = require("express");
const _ = express.Router();
const authRoute = require("./api/auth.ApiRoute.js");
const categoryRoute = require("./api/category.apiRoute.js");
const subcategoryRoute = require("./api/subcategory.apiRoute.js");
const { apiError } = require("../Utils/apiError");
const productRoute = require("./api/product.apiRoute.js");
const bannerRoute = require("./api/banner.apiRoute.js");
const flashsaleRoute = require("./api/flashsale.apiRoute.js");

const baseApi = process.env.BASE_API;

_.use(baseApi, authRoute);
_.use(baseApi, categoryRoute);
_.use(baseApi, subcategoryRoute);
_.use(baseApi, productRoute);
_.use(baseApi, bannerRoute);
_.use(baseApi, flashsaleRoute);

_.use("*", (req, res) => {
  res.status(405).json(new apiError(false, null, "Your Rooute is Invalid"));
});

module.exports = _;
