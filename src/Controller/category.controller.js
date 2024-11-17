const categoryModel = require("../Model/category.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "Name or description missing!!", true)
        );
    }
    const isExistCategory = await categoryModel.find({ name: name });
    if (isExistCategory?.length) {
      return res
        .status(404)
        .json(new apiError(404, null, `${name} Category is already exist`));
    }
    const saveCategory = await categoryModel.create({
      name,
      description,
    });
    if (saveCategory) {
      return res
        .status(201)
        .json(new apiResponse(saveCategory, `${name} saved on Category list`));
    }
    return res
      .status(501)
      .json(new apiError(501, null, `${name} Category saving failed`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `Error from set Category controller: ${error}`,
          true
        )
      );
  }
};

const Allcategory = async (req, res) => {
  try {
    const allcategories = await categoryModel.find({});
    if (!allcategories?.length) {
      return res
        .status(404)
        .json(new apiError(404, null, `allcategories not found`));
    }
    return res
      .status(201)
      .json(new apiResponse(allcategories, `All Category fetch succusfully`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from Allcategory controller: ${error}`)
      );
  }
};

const singlgCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const SinglgCategory = await categoryModel.findById(id);
    if (!SinglgCategory) {
      return res
        .status(404)
        .json(new apiError(404, null, `This category not found`));
    }
    return res
      .status(201)
      .json(
        new apiResponse(SinglgCategory, `Single Category fetch succusfully`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from singlgCategory controller: ${error}`
        )
      );
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (updatedCategory) {
      return res
        .status(201)
        .json(new apiResponse(updatedCategory, `Category Update seccussful`));
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from updateCategory controller: ${error}`
        )
      );
  }
};

module.exports = {
  createCategory,
  Allcategory,
  singlgCategory,
  updateCategory,
};