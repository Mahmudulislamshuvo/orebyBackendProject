const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const { Mailchecker, PasswordChecker } = require("../Helper/validator.js");
const userModel = require("../Model/user.model");
const { makeHashPassword, comparePassword } = require("../Helper/bcrypt.js");
const { sendMail } = require("../Helper/nodemailer.js");
const { numbergenertor } = require("../Helper/numbergen.js");
const { makeJWTToken } = require("../Helper/jwtToken.js");

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
    // save data to database with single time otp
    if (IsMaiSend) {
      const saveUserdata = await new userModel({
        firstName,
        email,
        mobile,
        address1,
        password: HashPass,
        Otp: Otp,
      }).save();
      // otp save to database temporary comment
      setTimeout(() => {
        saveUserdata.Otp = null;
        saveUserdata.save();
      }, 10000 * 20);
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

const OtpVerify = async (req, res) => {
  try {
    const { email, Otp } = req.body;
    if (!email || !Otp) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Otp creadential missing", true));
    }
    const IsExistingUser = await userModel
      .findOne({ email: email, Otp: Otp })
      .select("-password -email -Otp");
    if (!IsExistingUser) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Otp or Email mismatch", true));
    }
    IsExistingUser.isVerified = true;
    IsExistingUser.Otp = null;
    await IsExistingUser.save();
    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          IsExistingUser,
          "Otp verification succesfull",
          false
        )
      );
  } catch (error) {
    return res
      .status(404)
      .json(new apiError(false, 404, null, "Otp verify failed", true));
  }
};

const login = async (req, res) => {
  try {
    const { emailOrphone, password } = req.body;
    if (!emailOrphone || !password) {
      return res
        .status(404)
        .json(
          new apiError(false, 402, null, "Email or Password Missing!!", true)
        );
    }
    // check the user is valid or not
    const loggedUser = await userModel.findOne({
      $or: [{ email: emailOrphone }, { mobile: emailOrphone }],
    });
    // decript the password
    const IspassCorrect = await comparePassword(password, loggedUser?.password);

    if (!IspassCorrect) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Login credential invalid", true));
    }

    const TokenPayload = {
      id: loggedUser._id,
      email: loggedUser.email,
    };

    const token = await makeJWTToken(TokenPayload);

    if (token) {
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true, secure: true })
        .json(
          new apiResponse(
            true,
            {
              token: token,
              useremail: loggedUser.email,
              userName: loggedUser.firstName,
              userId: loggedUser._id,
            },
            "Login seccessfull with token",
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(false, 501, null, `login failed : ${error}`, true));
  }
};

const logout = async (req, res) => {
  try {
    return res
      .status(201)
      .clearCookie("token")
      .json(new apiResponse(true, null, "Logout Successfull", false));
  } catch (error) {
    return res
      .status(404)
      .json(
        new apiError(false, 402, null, `Error from logout: ${error}`, true)
      );
  }
};

const resetPassword = async (req, res) => {
  try {
    const { emailOrphone, oldPassword, newPassword } = req.body;
    for (let key in req.body) {
      // console.log(req.body[key]);
      if (!req.body[key]) {
        return res
          .status(404)
          .json(
            new apiError(
              false,
              402,
              null,
              `Email/Password creadential missisng: ${key}`,
              true
            )
          );
      }
    }
    if (!PasswordChecker(req.body.newPassword)) {
      return res
        .status(404)
        .json(new apiError(false, 402, null, `Password formate invalid`, true));
    }
    const CheckUser = await userModel.findOne({
      $or: [
        { mobile: req.body.emailOrphone },
        { email: req.body.emailOrphone },
      ],
    });

    // check the old password with database
    const IspasswordValid = await comparePassword(
      req.body.oldPassword,
      CheckUser?.password
    );

    if (!CheckUser || !IspasswordValid) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `User in not valid`, true));
    }
    // hash new password and check
    const hashNewPassword = await makeHashPassword(req.body.newPassword);
    if (hashNewPassword) {
      CheckUser.password = hashNewPassword;
      await CheckUser.save();
      return res.status(201).json(
        new apiResponse(
          true,
          {
            data: {
              name: CheckUser.firstName,
              email: CheckUser.email,
            },
          },
          "Password changed Successfull",
          false
        )
      );
    }
    return res
      .status(404)
      .json(new apiError(false, 404, null, `User invalid`, true));
  } catch (error) {
    return res
      .status(404)
      .json(
        new apiError(
          false,
          402,
          null,
          `Error from resetPass controller: ${error}`,
          true
        )
      );
  }
};

const resetEmail = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel
      .findOne({ _id: userId })
      .select("-address1 -Otp -isVerified");
    const { newEmail, password } = req.body;
    if (!newEmail || !password) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, "Email or Password missing!!", true)
        );
    }
    // check password
    const IspasswordValid = await comparePassword(
      req.body.password,
      user?.password
    );
    if (!IspasswordValid) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "Password wrong for Email chnage",
            true
          )
        );
    }

    if (user.email === newEmail) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "This email already exist", true));
    }
    if (user) {
      user.email = newEmail;
      user.save();
      return res
        .status(201)
        .json(new apiResponse(true, user, "email update Successfull", false));
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `Error from resetEmail controller: ${error}`,
          true
        )
      );
  }
};

const setRecoveryEmail = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recoveryEmail, password } = req.body;
    if (
      !recoveryEmail ||
      !password ||
      !Mailchecker(recoveryEmail) ||
      !PasswordChecker(password)
    ) {
      return res
        .status(404)
        .json(
          new apiError(
            false,
            404,
            null,
            "Password Or Password format invaid/Email Or Password missing!!",
            true
          )
        );
    }
    // const recovery = await userModel.findOneAndUpdate(
    //   { _id: userId },
    //   { $set: { recoveryEmail: recoveryEmail } },
    //   { new: true }
    // );
    // check the old password with database

    const recovery = await userModel
      .findOneAndUpdate({ _id: userId })
      .select("-password -role -Otp -isVerified -address1");
    // checking password from database
    const findPassword = await userModel.findOne({ _id: userId });
    const IspasswordValid = await comparePassword(
      req.body.password,
      findPassword?.password
    );

    if (!IspasswordValid) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Password wrong", true));
    }
    if (recovery.recoveryEmail === recoveryEmail) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "email already exist", true));
    }
    if (recovery) {
      recovery.recoveryEmail = recoveryEmail;
      await recovery.save();
      return res
        .status(201)
        .json(
          new apiResponse(
            true,
            recovery,
            "Recovery email update Successfull",
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `server error User not found`, true)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `Error from set RecoveryEmail controller: ${error}`,
          true
        )
      );
  }
};

module.exports = {
  Registration,
  OtpVerify,
  login,
  logout,
  resetPassword,
  resetEmail,
  setRecoveryEmail,
};
