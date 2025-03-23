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
        .json(
          new apiResponse(true, saveCategory, `${name} saved on Category list`),
          false
        );
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
      { ...updateObj },
      { new: true }
    );
    if (updatedCategory) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            updatedCategory,
            `Category Update seccussful`,
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
          `Error from updateCategory controller: ${error}`
        )
      );
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get the category ID from URL params

    if (!id) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "Category ID is missing!", true));
    }

    // Find the category by ID
    const category = await categoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Category not found!", true));
    }

    // Optionally, delete the category image from Cloudinary if needed
    // For example, if your category.image holds a URL, you could extract the public_id and delete it:
    const oldCloudinaryImage = category.image.split("/");
    const publicId =
      oldCloudinaryImage[oldCloudinaryImage.length - 1].split(".")[0];
    const deleteResult = await deleteCloudinaryFile(publicId);
    if (!deleteResult?.deleted) {
      return res
        .status(500)
        .json(
          new apiError(
            false,
            500,
            null,
            "Failed to delete image from Cloudinary",
            true
          )
        );
    }

    // Delete the category from the database
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (deletedCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            deletedCategory,
            "Category deleted successfully",
            false
          )
        );
    } else {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, "Failed to delete category", true)
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `Error from delete category controller: ${error}`,
          true
        )
      );
  }
};

module.exports = {
  createCategory,
  Allcategory,
  singlgCategory,
  updateCategory,
  deleteCategory,
};
