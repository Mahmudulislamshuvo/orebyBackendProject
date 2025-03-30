const productModel = require("../Model/product.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const { StaticFileGenerator } = require("../Helper/staticFileGenerator");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary");
const categoryModel = require("../Model/category.model");

// create products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      review,
      stock,
      rating,
      discount,
    } = req.body;

    if (!name || !description || !price || !category || !subCategory) {
      return res
        .status(404)
        .json(new apiError(404, null, `product credential missing!!`));
    }

    if (!req?.files) {
      return res
        .status(404)
        .json(new apiError(404, null, `product image missing!!`));
    }

    const allImage = req.files?.image;
    let allUploadImg = [];
    for (let image of allImage) {
      let UploadedFile = await uploadCloudinaryFile(image?.path);
      allUploadImg.push(UploadedFile.secure_url);
    }

    const allImageWithDomain = StaticFileGenerator(allImage);
    const alreadyExistproduct = await productModel.find({
      name: name,
    });
    if (alreadyExistproduct.length) {
      return res
        .status(404)
        .json(new apiError(404, null, `product already Exist`));
    }
    const savedProduct = await new productModel({
      name,
      description,
      price,
      image: allUploadImg,
      category,
      subCategory,
      review: review.split(","),
      stock,
      rating,
      discount,
    }).save();
    myCache.del("allproduct");
    if (savedProduct) {
      const searchCategory = await categoryModel.findOne({ _id: category });
      searchCategory.product.push(savedProduct._id);
      await searchCategory.save();

      // another way from support team

      // await categoryModel.findOneAndUpdate(
      //   { _id: category },
      //   {
      //     $push: {
      //       product: savedProduct._id,
      //     },
      //   }
      // );
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            savedProduct,
            `Product created succusfully`,
            false
          )
        );
    }
    return res
      .status(404)
      .json(new apiError(404, null, `unable to create product try again`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `createProduct failed from createProduct controller: ${error}`
        )
      );
  }
};

// get all product
const getAllproducts = async (req, res) => {
  try {
    // Check if data exists in cache
    const cachedValue = myCache.get("allproduct");

    if (cachedValue) {
      // If cached data is found, parse and return it
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            JSON.parse(cachedValue),
            `All products retrieved successfully from cache`,
            false
          )
        );
    }

    // If no cache, fetch data from database
    const allProducts = await productModel
      .find({})
      .populate(["category", "subCategory"]);

    if (!allProducts) {
      return res
        .status(404)
        .json(
          new apiError(
            404,
            null,
            `Unable to retrieve products, please try again`
          )
        );
    }

    // Cache the data for future use
    myCache.set("allproduct", JSON.stringify(allProducts), 600 * 600);

    // Return fetched data
    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          allProducts,
          `All products retrieved successfully`,
          false
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          `GetAllProduct failed! Error from controller: ${error.message}`
        )
      );
  }
};

// update product name or details
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Product not found", true));
    }

    const updates = req.body;
    let imagesToDelete = [];
    let newImages = [];

    // Handle image update
    if (req.files?.image?.length) {
      try {
        imagesToDelete = [...product.image];

        // Upload new images
        newImages = await Promise.all(
          req.files.image.map(async (file) => {
            const result = await uploadCloudinaryFile(file.path);
            return result.secure_url;
          })
        );

        updates.image = newImages;
      } catch (uploadError) {
        return res
          .status(500)
          .json(
            new apiError(
              false,
              500,
              null,
              `Image upload failed: ${uploadError.message}`,
              true
            )
          );
      }
    }

    // Prepare update fields
    const updatedFields = {
      ...updates,
      ...(newImages.length && { image: newImages }),
    };

    // Check for empty updates
    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "No changes provided", true));
    }

    // Update product in database
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true, runValidators: true }
    );

    // Cleanup old images after successful update
    if (imagesToDelete.length > 0) {
      try {
        await Promise.all(
          imagesToDelete.map(async (imageUrl) => {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await deleteCloudinaryFile(publicId);
          })
        );
      } catch (deleteError) {
        console.error("Old image cleanup failed:", deleteError);
      }
    }

    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          updatedProduct,
          "Product updated successfully",
          false
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(false, 500, null, `Update failed: ${error.message}`, true)
      );
  }
};
// get single product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const SingleProduct = await productModel
      .findById(productId)
      .populate(["category", "subCategory"])
      .lean();

    if (SingleProduct) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            SingleProduct,
            `Single product retrive successfull`,
            false
          )
        );
    }
    return res
      .status(401)
      .json(new apiError(401, null, `Single Product not found!!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Retrive Single Product failed!! Error from GetSingleProduct controller: ${error}`
        )
      );
  }
};

const deleteSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedItem = await productModel.findByIdAndDelete({
      _id: productId,
    });
    myCache.del("allproduct");
    if (deletedItem) {
      return res
        .status(201)
        .json(
          new apiResponse(deletedItem, `Single product deleted successfull`)
        );
    }
    return res
      .status(401)
      .json(new apiError(401, null, `Single Product not found for delete!!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Delete Single Product failed!! Error from Delete_Single_Product controller: ${error}`
        )
      );
  }
};

module.exports = {
  createProduct,
  getAllproducts,
  updateProduct,
  getSingleProduct,
  deleteSingleProduct,
};
