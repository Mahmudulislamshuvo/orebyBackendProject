const express = require("express");
const _ = express.Router();
const authRoute = require("./api/auth.ApiRoute.js");
const categoryRoute = require("./api/category.apiRoute.js");
const subcategoryRoute = require("./api/subcategory.apiRoute.js");
const { apiError } = require("../Utils/apiError");
const productRoute = require("./api/product.apiRoute.js");
const bannerRoute = require("./api/banner.apiRoute.js");
const flashsaleRoute = require("./api/flashsale.apiRoute.js");
const bestsellingRoute = require("./api/bestselling.apiRoute.js");
const contactusRoute = require("./api/contactus.apiRoute.js");
const cartRoute = require("./api/cart.apiRoute.js");
const orderRoute = require("./api/order.apiRote");
const paymentRoute = require("./api/payment.apiRoute");

const baseApi = process.env.BASE_API;

_.use(baseApi, authRoute);
_.use(baseApi, categoryRoute);
_.use(baseApi, subcategoryRoute);
_.use(baseApi, productRoute);
_.use(baseApi, bannerRoute);
_.use(baseApi, flashsaleRoute);
_.use(baseApi, bestsellingRoute);
_.use(baseApi, contactusRoute);
_.use(baseApi, cartRoute);
_.use(baseApi, orderRoute);
_.use(baseApi, paymentRoute);

_.use("*", (req, res) => {
  res.status(405).json(new apiError(false, null, "Your Rooute is Invalid"));
});

module.exports = _;
