const subCategoryModel = require("../Model/subCategory.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const subCategory = async (req, res) => {
  try {
    for (let key in req.body) {
      if (!req.body[key]) {
        return res
          .status(401)
          .json(
            new apiError(402, null, `subCategory credential ${key} missing!!`)
          );
      }
    }
    const alreadyExistsubCategory = await subCategoryModel.find({
      name: req.body.name,
    });
    if (alreadyExistsubCategory?.length) {
      return res
        .status(401)
        .json(
          new apiError(
            401,
            null,
            `${req.body.name} SubCategory already exist in our system`
          )
        );
    }
    const saveSubCategory = await subCategoryModel.create({ ...req.body });
    if (saveSubCategory) {
      return res
        .status(201)
        .json(
          new apiResponse(saveSubCategory, `subCategory saved successfully`)
        );
    }
    return res
      .status(401)
      .json(
        new apiError(402, null, `subCategory not found or failed to save!!`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from SubCategory controller: ${error}`)
      );
  }
};

module.exports = { subCategory };
