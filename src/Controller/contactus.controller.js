const contactUsModel = require("../Model/contactus.model");
const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const createContactUs = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            `name or email or phone or message Missing!!`,
            true
          )
        );
    }
    // Save to our Database
    const contacttextSave = await new contactUsModel({
      name: name,
      email: email,
      phone: phone,
      message: message,
    }).save();
    console.log(contacttextSave);

    if (contacttextSave) {
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            contacttextSave,
            `ContactUs message sent succusfully and Saved`,
            false
          )
        );
    }
    return res
      .status(404)
      .json(new apiError(false, 404, null, `Unavle to save try again`, true));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `Error from create ContactUs controller: ${error}`,
          true
        )
      );
  }
};

const getAllContactUsEmails = async (req, res) => {
  try {
    const allContactUsMessages = await contactUsModel.find();
    if (allContactUsMessages.length === 0) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "No Contact Us messages found!", true)
        );
    }
    // If messages exist, return the messages in the response
    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          allContactUsMessages,
          "All Contact Us messages retrieved successfully",
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `Error from getAllContactUsEmails controller: ${error}`,
          true
        )
      );
  }
};

module.exports = { createContactUs, getAllContactUsEmails };
