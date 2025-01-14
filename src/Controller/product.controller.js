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
      review,
      stock,
      rating,
      discount,
    }).save();

    if (savedProduct) {
      return res
        .status(201)
        .json(new apiResponse(savedProduct, `Product created succusfully`));
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
// const getAllproducts = async (req, res) => {
//   try {
//     const value = myCache.get("allproduct");

//     const allProducts = await productModel
//       .find({})
//       .populate(["category", "subCategory"]);
//     myCache.set("allproduct", JSON.stringify(allProducts), 600 * 600);
//     if (value == undefined) {
//       if (allProducts) {
//         return res
//           .status(201)
//           .json(
//             new apiResponse(
//               true,
//               allProducts,
//               `All product retrive successfull`,
//               false
//             )
//           );
//       }
//     } else {
//       return res
//         .status(201)
//         .json(
//           new apiResponse(
//             JSON.parse(value),
//             true,
//             allProducts,
//             `Allproduct retrive success from Else`,
//             false
//           )
//         );
//     }

//     return res
//       .status(404)
//       .json(new apiError(404, null, `unable to retrive All product try again`));
//   } catch (error) {
//     return res
//       .status(501)
//       .json(
//         new apiError(
//           501,
//           null,
//           `GetAllProduct failed!! Error from GetAllProduct controller: ${error}`
//         )
//       );
//   }
// };
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
    // update product=========
    const { productId } = req.params;
    const IsExistProduct = await productModel.findById(productId);
    if (!IsExistProduct) {
      return res
        .status(404)
        .json(new apiError(404, null, `product not found!!`));
    }
    // update img===
    let delete_resourcesCloudinary = null;
    let allUploadImg = [];
    if (req.files?.image) {
      for (image of IsExistProduct.image) {
        const splitImageAdress = image.split("/");
        const cloudinaryFilePath =
          splitImageAdress[splitImageAdress.length - 1].split(".")[0];
        delete_resourcesCloudinary =
          await deleteCloudinaryFile(cloudinaryFilePath);
      }

      if (delete_resourcesCloudinary) {
        for (let image of req.files?.image) {
          let UploadedFile = await uploadCloudinaryFile(image?.path);
          allUploadImg.push(UploadedFile.secure_url);
        }
        const updatedProduct = await productModel.findByIdAndUpdate(
          {
            _id: productId,
          },
          { ...req.body },
          { new: true }
        );
        return res
          .status(201)
          .json(new apiResponse(updatedProduct, `updated Product succusfully`));
      }
    }

    // console.log(updatedProduct);
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `update product failed!! Error from updateProduct controller: ${error}`
        )
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
    console.log(SingleProduct);

    if (SingleProduct) {
      return res
        .status(201)
        .json(
          new apiResponse(SingleProduct, `Single product retrive successfull`)
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
