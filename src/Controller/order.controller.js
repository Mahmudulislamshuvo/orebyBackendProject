const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const orderModel = require("../Model/order.model");
const userModel = require("../Model/user.model");

const placeOrder = async (req, res) => {
  try {
    // split bearer word from token
    const token = req.headers.authorization.replace("Bearer", "").trim();

    const { userId } = req.user;
    const { customerinfo, paymentinfo } = req.body;
    const { address1, city, division, postCode } = customerinfo;
    const { paymentMethod } = paymentinfo;
    // checking there anything missing
    if (!address1 || !city || !division || !postCode || !paymentMethod) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `Order credential missing`, true));
    }
    // find user
    const user = await userModel.findById(userId);
    // find user Items with api hit
    const response = await fetch("http://localhost:3000/api/v1/usercart", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // cart item information getting
    const { totalAmount, totalQuantity } = data?.data;
    if (paymentMethod == "cash") {
      // save the order on proccesing
      const saveOrder = new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo: customerinfo,
        paymentinfo,
        subtotal: totalAmount,
        totalitem: totalQuantity,
      }).save();
      return res.status(201).json(`Temporary response`);
    } else {
      return res.status(400).json(`Temporary response SSl commers`);
    }
  } catch (error) {
    return res
      .status(505)
      .json(
        new apiError(
          false,
          505,
          null,
          `Error from placeOrder controller ${error}`,
          true
        )
      );
  }
};

module.exports = { placeOrder };
