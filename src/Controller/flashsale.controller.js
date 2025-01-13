const flashSaleModel = require("../Model/flashsale.model.js");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const createFlashSale = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "product not found!!", true));
    }
    const isAlreadyexist = await flashSaleModel.findOne({ product: product });

    //   saveing Flashsale Product
    if (isAlreadyexist) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "Flashsale product already exist!!",
            true
          )
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
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from Create Flashsale ${error}`,
          true
        )
      );
  }
};

const GetAllFlashsaleProduct = async (req, res) => {
  try {
    const AllFlashsalProducts = await flashSaleModel
      .find()
      .populate({ path: "product" });

    if (!AllFlashsalProducts) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "Flashsell product missing", true)
        );
    }
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          AllFlashsalProducts,
          `FlashSale Product retrived`,
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from GetAllFlashsaleProduct ${error}`,
          true
        )
      );
  }
};

const UpdateFlashSaleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "Flashsell product not found for update",
            true
          )
        );
    }
    const UpdatedProduct = await flashSaleModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!UpdatedProduct) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Flashsell unable update", true));
    }
    return res
      .status(201)
      .json(
        new apiResponse(true, UpdatedProduct, `FlashSale Prduct updated`, false)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from UpdateFlashSaleProduct ${error}`,
          true
        )
      );
  }
};

const deleteFlashSaleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "Flashsell product not missing for delete",
            true
          )
        );
    }
    const DedetedFlashSaleItem = await flashSaleModel.findOneAndDelete({
      _id: id,
    });

    if (!DedetedFlashSaleItem) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "Flashsell Unable to delete", true)
        );
    }
    return res
      .status(201)
      .json(new apiResponse(DedetedFlashSaleItem, `FlashSale Prduct Deleted`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from deleteFlashSaleProduct controller ${error}`,
          true
        )
      );
  }
};

module.exports = {
  createFlashSale,
  GetAllFlashsaleProduct,
  UpdateFlashSaleProduct,
  deleteFlashSaleProduct,
};
