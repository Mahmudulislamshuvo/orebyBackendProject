const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const orderModel = require("../Model/order.model");

const placeOrder = async (req, res) => {
  try {
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
