const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const invoiceModel = require("../Model/invoice.model");
const orderModel = require("../Model/order.model");

const successPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findById({ tranId: id });
    if (!invoice) {
      return res
        .status(404)
        .json(new apiError(true, 404, null, `Products not found`));
    }

    return res
      .status(201)
      .json(new apiResponse(true, "trying", `Payment Successful`, false));
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

module.exports = { successPayment };
