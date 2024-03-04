// Require the cloudinary library
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Log the configuration
// console.log(cloudinary.config());

const uploadOnCloudinary = async (localFilePath, public_id) => {
  if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id,
    });
    // console.log(
    //   "File has beene uploaded successfully",
    //   response.url,
    //   response.public_id
    // );
    fs.unlink(`${localFilePath}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File is deleted");
      }
    });
    return response;
  } catch (error) {
    //delete (unlink) the locally stored file o the server in case of any error
    fs.unlink(localFilePath);
    console.log(error);
    return null;
  }
};

module.exports = uploadOnCloudinary;
