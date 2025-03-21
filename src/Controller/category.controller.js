const categoryModel = require("../Model/category.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary");

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
    const AllCategoryImg = req?.files;
    const UploadedImgPath = AllCategoryImg.image[0].path;
    const uploadToCloudinary = await uploadCloudinaryFile(UploadedImgPath);
    const ImgWithDomain = deleteCloudinaryFile(req.files?.image);

    const isExistCategory = await categoryModel.find({ name: name });
    if (isExistCategory?.length) {
      return res
        .status(404)
        .json(new apiError(404, null, `${name} Category is already exist`));
    }
    const saveCategory = await categoryModel.create({
      name,
      description,
      image: uploadToCloudinary.secure_url,
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
    const allcategories = await categoryModel.find({}).populate("subCategory");
    if (!allcategories?.length) {
      return res
        .status(404)
        .json(new apiError(404, null, `allcategories not found`));
    }
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          allcategories,
          `All Category fetch succusfully`,
          false
        )
      );
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
    const SinglgCategory = await categoryModel
      .findById(id)
      .populate(["product", "subCategory"]);
    if (!SinglgCategory) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `This category not found`, true));
    }
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          SinglgCategory,
          `Single Category fetch succusfully`,
          false
        )
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
    const searchItem = await categoryModel.findById(id);
    if (!searchItem) {
      return res
        .status(404)
        .json(new apiError(404, null, `Category not found for update`));
    }
    // Image
    const image = req.files?.image;
    const updateObj = {};

    if (image) {
      const oldCloudinaryImage = searchItem.image.split("/");
      const DeleteUrl =
        oldCloudinaryImage[oldCloudinaryImage?.length - 1].split(".")[0];
      const deleteResult = await deleteCloudinaryFile(DeleteUrl);

      if (!deleteResult?.deleted) {
        return res
          .status(404)
          .json(new apiError(404, null, `Delete file not found`));
      }
      const { secure_url } = await uploadCloudinaryFile(image[0].path); // Upload new image
      updateObj.image = secure_url;
    }
    // setting to updateObj for updating description
    if (req.body.description) {
      updateObj.description = req.body.description;
    }
    // setting to updateObj for updating name
    if (req.body.name) {
      updateObj.name = req.body.name;
    }
    // updating database
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
