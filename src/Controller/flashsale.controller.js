const flashSaleModel = require("../Model/flashsale.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const createFlashSale = async (req, res) => {
  const { product } = req.body;
  if (!product) {
    return res
      .status(404)
      .json(new apiError(false, 404, null, "product not found!!", true));
  }
  const isAlreadyexist = await flashSaleModel.findOne({});
  //   saveing Flashsale Product
  if (isAlreadyexist) {
    return res
      .status(404)
      .json(
        new apiError(false, 404, null, "Flashsale productalready exist!!", true)
      );
  }
  const saveFlashSaleProduct = await flashSaleModel.create({
    product: product,
  });
  if (!saveFlashSaleProduct) {
    return res
      .status(404)
      .json(
        new apiError(
          false,
          404,
          null,
          "Flashsale product saving failed try again!",
          true
        )
      );
  }
  return res
    .status(201)
    .json(
      new apiResponse(
        saveFlashSaleProduct,
        `FlashSale Product created and saved`
      )
    );
};

module.exports = { createFlashSale };
