const subCategoryModel = require("../Model/subCategory.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const CategoryModel = require("../Model/category.model");

const subCategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    if (!name || !description || !category) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, `Name/Description, Category missing`),
          true
        );
    }
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
      const findCategory = await CategoryModel.findOne({
        _id: req.body.category,
      });
      if (!findCategory) {
        return res
          .status(401)
          .json(new apiError(401, null, `Category not found!!`));
      }
      findCategory.subCategory.push(saveSubCategory._id);
      await findCategory.save();
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            saveSubCategory,
            `subCategory saved successfully`,
            false
          )
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

const getAllsubCategory = async (req, res) => {
  try {
    const allSubCategory = await subCategoryModel.find().populate("category");
    if (allSubCategory) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            allSubCategory,
            `All subCategory retrive successfully`,
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from getAllsubCategory controller: ${error}`
        )
      );
  }
};

const SingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleSubCategory = await subCategoryModel
      .findById(id)
      .populate("category");
    if (singleSubCategory) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            singleSubCategory,
            `Single subCategory retrive successfully`,
            false
          )
        );
    }
    return res
      .status(401)
      .json(new apiError(402, null, `Single SubCategory not found!!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from Single SubCategory controller: ${error}`
        )
      );
  }
};

const DeteleSingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await subCategoryModel
      .findByIdAndDelete({ _id: id })
      .select("-category -product");
    if (deletedItem) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            deletedItem,
            `Single subCategory ${deletedItem.name} deleted successfully`,
            false
          )
        );
    }
    return res
      .status(401)
      .json(
        new apiError(402, null, `Single Subcategory not found for delete!!`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from Delete Single SubCategory controller: ${error}`
        )
      );
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubcategory = await subCategoryModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (updatedSubcategory) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            updatedSubcategory,
            `subCategory updated successfully`,
            false
          )
        );
    }
    return res
      .status(401)
      .json(
        new apiError(402, null, `ubcategory not found for update failed!!`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from update SubCategory controller: ${error}`
        )
      );
  }
};

module.exports = {
  subCategory,
  getAllsubCategory,
  SingleSubCategory,
  DeteleSingleSubCategory,
  updateSubCategory,
};
