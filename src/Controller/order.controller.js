const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const orderModel = require("../Model/order.model");
const userModel = require("../Model/user.model");
const InvoiceModel = require("../Model/invoice.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const crypto = require("crypto");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.ISLIVE == false;

const placeOrder = async (req, res) => {
  try {
    // Split Bearer token from header
    const token = req.headers.authorization.replace("Bearer", "").trim();

    const { userId } = req.user;
    const { customerinfo, paymentinfo } = req.body;
    const { address1, city, division, postCode } = customerinfo;
    const { paymentMethod } = paymentinfo;

    // Check if required fields are missing
    if (!address1 || !city || !division || !postCode || !paymentMethod) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, `Order credentials missing`, true)
        );
    }

    // Find user by id
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `User not found`, true));
    }

    // Fetch user cart items from another API endpoint
    const response = await fetch("http://localhost:3000/api/v1/usercart", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            `Unable to fetch data from usercart`,
            true
          )
        );
    }
    const data = await response.json();
    const { totalAmount, totalQuantity } = data?.data;

    // Create a transaction id
    const transsection_id = crypto.randomUUID().split("-")[0];

    // For Cash Payment
    if (paymentMethod.toLowerCase() === "cash") {
      // Save the order as processing
      const saveOrder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo: customerinfo,
        paymentinfo,
        subtotal: totalAmount,
        totalitem: totalQuantity,
      }).save();

      // Saving Invoice
      const invoice = await new InvoiceModel({
        tranId: transsection_id,
        subtotal: totalAmount,
        user: userId,
        customerDetails: customerinfo,
        order: saveOrder._id,
      }).save();

      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            saveOrder,
            `Order and Invoice created for Cash Payment`,
            false
          )
        );
    }
    // For Online Payment
    else if (paymentMethod.toLowerCase() === "online") {
      const sslData = {
        total_amount: totalAmount,
        currency: "BDT",
        tran_id: transsection_id, // unique tran_id for each API call
        success_url: `http://localhost:3000/api/v1/success/${transsection_id}`,
        fail_url: `http://localhost:3000/api/v1/failed/${transsection_id}`,
        cancel_url: `http://localhost:3000/api/v1/cancel/${transsection_id}`,
        ipn_url: `http://localhost:3000/api/v1/ipn/${transsection_id}`,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      // Initialize SSLCommerzPayment with env variables
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

      // Save order and invoice first
      const saveOrder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo: customerinfo,
        paymentinfo,
        subtotal: totalAmount,
        totalitem: totalQuantity,
      }).save();

      await new InvoiceModel({
        tranId: transsection_id,
        subtotal: totalAmount,
        user: userId,
        customerDetails: customerinfo,
        order: saveOrder._id,
      }).save();

      // Initiate payment and get the payment link or API response
      const sslApiResponse = await sslcz.init(sslData);
      if (!sslApiResponse) {
        return res
          .status(404)
          .json(
            new apiError(
              false,
              404,
              null,
              `Payment initialization failed`,
              true
            )
          );
      }
      console.log(sslApiResponse?.GatewayPageURL);

      // Return the SSLCommerz payment link or API response data
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            sslApiResponse,
            `Payment initialization successful`,
            false
          )
        );
    } else {
      // Invalid payment method branch
      return res
        .status(401)
        .json(new apiError(false, 401, null, `Invalid Payment Method`, true));
    }
  } catch (error) {
    return res
      .status(505)
      .json(
        new apiError(
          false,
          505,
          null,
          `Error from placeOrder controller: ${error} another: ${error.message}`,
          true
        )
      );
  }
};

module.exports = { placeOrder };
