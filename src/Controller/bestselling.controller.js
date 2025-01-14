const bestSellingModel = require("../Model/bestselling.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const createBestselling = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "Best selling product not found!!",
            true
          )
        );
    }
    const isAlreadyexist = await bestSellingModel.findOne({ product: product });

    //   saveing Flashsale Product
    if (isAlreadyexist) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "BestSelling product already exist!!",
            true
          )
        );
    }
    const saveBestsellingProduct = await bestSellingModel.create({
      product: product,
    });
    if (!saveBestsellingProduct) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "BestSelling product saving failed try again!",
            true
          )
        );
    }
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          saveBestsellingProduct,
          `BestSelling Product created and saved`,
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
          `error from Create BestSelling controller ${error}`,
          true
        )
      );
  }
};

const GetAllBestsellingProduct = async (req, res) => {
  try {
    const AllBestsellingProducts = await bestSellingModel
      .find()
      .populate({ path: "product" });

    if (!AllBestsellingProducts) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "BestSelling product missing", true)
        );
    }
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          AllBestsellingProducts,
          `BestSelling Product retrived`,
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
          `error from GetAllBestSellingProduct ${error}`,
          true
        )
      );
  }
};

const UpdateBestSellingProduct = async (req, res) => {
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
            "BestSelling product not found for update",
            true
          )
        );
    }
    const UpdatedBestsellingProduct = await bestSellingModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!UpdatedBestsellingProduct) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "BestSelling unable update", true)
        );
    }
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          UpdatedBestsellingProduct,
          `BestSelling Prduct updated`,
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
          `error from BestSelling Update controller ${error}`,
          true
        )
      );
  }
};

const deleteBestSellingProduct = async (req, res) => {
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
            "BestSelling product not missing for delete",
            true
          )
        );
    }
    const DedetedBestsellingItem = await bestSellingModel.findOneAndDelete({
      _id: id,
    });

    if (!DedetedBestsellingItem) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "BestSelling Unable to delete", true)
        );
    }
    return res
      .status(201)
      .json(
        new apiResponse(DedetedBestsellingItem, `BestSelling Prduct Deleted`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from deleteBestSellingProduct controller ${error}`,
          true
        )
      );
  }
};

module.exports = {
  createBestselling,
  GetAllBestsellingProduct,
  UpdateBestSellingProduct,
  deleteBestSellingProduct,
};
