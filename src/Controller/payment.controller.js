const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const invoiceModel = require("../Model/invoice.model");
const orderModel = require("../Model/order.model");
const userModel = require("../Model/user.model");
const cartModel = require("../Model/cart.model");

const successPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tranId: id });
    if (!invoice) {
      return res
        .status(404)
        .json(new apiError(true, 404, null, `Products not found`));
    }
    invoice.paymentStatus = "success";
    invoice.save();

    // find db order database and update the payment status and delete user CartItems
    const order = await orderModel.findById(invoice.order._id);

    const userinfo = await userModel
      .findById(invoice.user._id)
      .select("-password -recoveryEmail -otpExpire -Otp");

    order.cartItem.forEach(async (item) => {
      await userinfo.cartitem.pull(item);
      await cartModel.findOneAndDelete({ _id: item });
    });
    await userinfo.save();

    // update ispaid
    order.paymentinfo.isPaid = true;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/payment/success`);
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `error from successPayment controller: ${error}`
        )
      );
  }
};

const failedPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await invoiceModel.findOne({ tranId: id });

    if (!invoice) {
      return res
        .status(404)
        .json(new apiError(true, 404, null, `Invoice not found`));
    }

    invoice.paymentStatus = "failed";
    await invoice.save();

    const order = await orderModel.findById(invoice.order._id);

    order.paymentinfo.isPaid = false;
    await order.save();

    const userinfo = await userModel
      .findById(invoice.user._id)
      .select("-password -recoveryEmail -otpExpire -Otp");

    order.cartItem.forEach(async (item) => {
      await userinfo.cartitem.addToSet(item);
    });
    await userinfo.save();

    return res.redirect(`${process.env.FRONTEND_DOMAIN}/payment/failed`);
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `error from failedPayment controller: ${error}`)
      );
  }
};

module.exports = { successPayment, failedPayment };
