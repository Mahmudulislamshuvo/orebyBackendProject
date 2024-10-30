const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const { Mailchecker, PasswordChecker } = require("../Helper/validator.js");
const userModel = require("../Model/user.model");
const { makeHashPassword } = require("../Helper/bcrypt.js");
const { sendMail } = require("../Helper/nodemailer.js");
const { numbergenertor } = require("../Helper/numbergen.js");

const Registration = async (req, res) => {
  try {
    const { firstName, email, mobile, address1, password } = req.body;
    // password and mail checker
    if (!firstName || !email || !mobile || !address1 || !password) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "User Credential missing!!", true)
        );
    }
    // Email and pass formate Checker
    if (!Mailchecker(email) || !PasswordChecker(password)) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "Email or Password formate invalid!!",
            true
          )
        );
    }
    // Hash password
    const HashPass = await makeHashPassword(password);
    // otp gen
    const Otp = await numbergenertor();
    // send account verification otp mail to user
    const IsMaiSend = await sendMail(email, Otp);
    // save data to database
    if (IsMaiSend) {
      const saveUserdata = await new userModel({
        firstName,
        email,
        mobile,
        address1,
        password: HashPass,
      }).save();
      return res
        .status(201)
        .json(
          new apiResponse(true, saveUserdata, "data saved to database", false)
        );
    }
    return res
      .status(501)
      .json(new apiError(false, 501, null, "Problem with send mail", true));
  } catch (error) {
    return res
      .status(505)
      .json(new apiError(false, 505, null, "Registration failed", true));
  }
};

module.exports = { Registration };
