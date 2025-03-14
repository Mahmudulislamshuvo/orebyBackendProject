const bannerModel = require("../Model/banner.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary");
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
    myCache.del("allbanner");
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
    const CacheData = myCache.get("allbanner");
    if (CacheData == undefined) {
      const allbanner = await bannerModel.find();
      myCache.set("allbanner", JSON.stringify(allbanner), 60 * 60);
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
    } else {
      const parsedCacheData = JSON.parse(CacheData);
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            parsedCacheData,
            `All Banner retrive succusfully from cache`,
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from getallBanner controller: ${error}`)
      );
  }
};

const getSinglebanner = async (req, res) => {
  try {
    const { id } = req.params;
    const SingleBanner = await bannerModel.findById(id);
    if (!SingleBanner) {
      return res
        .status(404)
        .json(new apiError(404, null, `single banner not found`));
    }
    return res
      .status(201)
      .json(new apiResponse(SingleBanner, `Single Banner retrive succusfully`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          501,
          null,
          `Error from getSinglebanner controller: ${error}`
        )
      );
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await bannerModel.findByIdAndDelete(id);
    if (!deletedItem) {
      return res
        .status(404)
        .json(new apiError(404, null, `single banner not found for Delete`));
    }
    return res
      .status(201)
      .json(new apiResponse(deletedItem, `Single Banner Deleted succusfully`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from Delete banner controller: ${error}`)
      );
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const searchItem = await bannerModel.findById(id);
    if (!searchItem) {
      return res
        .status(404)
        .json(new apiError(404, null, `banner not found for update`));
    }
    const image = req.files?.image;
    const updateObj = {};
    if (image) {
      const oldCloudinaryImage = searchItem.image.split("/");
      const DeleteUrl =
        oldCloudinaryImage[oldCloudinaryImage?.length - 1].split(".")[0];
      const updateObj = await deleteCloudinaryFile(DeleteUrl);
      if (!updateObj?.deleted) {
        return res
          .status(404)
          .json(new apiError(404, null, `Delete file not found`));
      }
      const { secure_url } = await uploadCloudinaryFile(image[0].path);
      updateObj.image = secure_url;
    }
    if (req.body.name) {
      updateObj.name = req.body.name;
    }
    const UpdatedBanner = await bannerModel.findByIdAndUpdate(
      { _id: id },
      { ...updateObj },
      { new: true }
    );
    if (UpdatedBanner) {
      return res
        .status(201)
        .json(new apiResponse(UpdatedBanner, `Banner updated successfully`));
    }
    return res
      .status(404)
      .json(new apiError(404, null, `unable to delete try again`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, `Error from update banner controller: ${error}`)
      );
  }
};

module.exports = {
  createBanner,
  getallBanner,
  getSinglebanner,
  deleteBanner,
  updateBanner,
};
