const productModel = require("../Model/product.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const { StaticFileGenerator } = require("../Helper/staticFileGenerator");

// create products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory } = req.body;
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
      image: allImageWithDomain,
      category,
      subCategory,
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
const getAllproducts = async (req, res) => {
  try {
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `GetAllProduct failed!! Error from GetAllProduct controller: ${error}`
        )
      );
  }
};

module.exports = { createProduct, getAllproducts };
