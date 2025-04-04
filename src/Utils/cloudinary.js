const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Upload an image
const uploadCloudinaryFile = async (localFilePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath);
    if (uploadResult) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    console.log("error from Cloudinary", error);
  }
};

const deleteCloudinaryFile = async (filepath) => {
  try {
    const deleteItem = await cloudinary.api.delete_resources([filepath], {
      type: "upload",
    });
    return deleteItem;
  } catch (error) {
    console.log("Error from deleteCloudinaryFile:", error);
    return null;
  }
};

module.exports = { uploadCloudinaryFile, deleteCloudinaryFile };
