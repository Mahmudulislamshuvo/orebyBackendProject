const bannerModel = require("../Model/banner.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const { uploadCloudinaryFile } = require("../Utils/cloudinary");
const { StaticFileGenerator } = require("../Helper/staticFileGenerator");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const createBanner = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(404)
        .json(new apiError(404, null, `banner name missing!!`));
    }
    if (!req?.files) {
      return res
        .status(404)
        .json(new apiError(404, null, `CreateBanner Img missing!!`));
    }
    const allImage = req.files?.image;
    const UploadedIMG = await uploadCloudinaryFile(allImage[0].path);
    const allIMGwithDomain = StaticFileGenerator(allImage);
    const AlreadyExistbanner = await bannerModel.find({
      name: name,
    });
    if (AlreadyExistbanner.length) {
      return res
        .status(404)
        .json(new apiError(404, null, `CreateBanner already exist!!`));
    }
    const saveBanner = await new bannerModel({
      name,
      image: UploadedIMG.secure_url,
    }).save();
    return res
      .status(201)
      .json(new apiResponse(saveBanner, `Banner created succusfully`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from creatBanner controller: ${error}`)
      );
  }
};

const getallBanner = async (req, res) => {
  try {
    const value = myCache.get("allbanner");
    if (value == undefined) {
      const allbanner = await bannerModel.find({});
      myCache.set("allbanner", JSON.stringify(allbanner), 600 * 600);
      if (allbanner) {
        return res
          .status(201)
          .json(new apiResponse(allbanner, `All Banner retrive succusfully`));
      }
      return res
        .status(504)
        .json(
          new apiError(504, null, `All banner unable to retrive try again!!`)
        );
      // check chatgtp
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from getallBanner controller: ${error}`)
      );
  }
};

module.exports = { createBanner, getallBanner };
