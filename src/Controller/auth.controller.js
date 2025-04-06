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
    const { firstName, email, mobile, password } = req.body;
    // Check required fields
    if (!firstName || !email || !mobile || !password) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "User credentials missing!", true)
        );
    }

    // Check email and password format first
    if (!Mailchecker(email) || !PasswordChecker(password)) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "Email or password format invalid!",
            true
          )
        );
    }

    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified === false) {
        // Generate a new OTP
        const newOtp = await numbergenertor();
        // Update the existing user with the new OTP and a new expiry time (10 minutes from now)
        existingUser.Otp = newOtp;
        existingUser.otpExpire = Date.now() + 10 * 60 * 1000;
        await existingUser.save();

        // Send the OTP email
        const emailSent = await sendMail(email, newOtp);
        if (!emailSent) {
          return res
            .status(401)
            .json(
              new apiError(
                false,
                401,
                null,
                "Unable to send OTP email. Please try again.",
                true
              )
            );
        }

        return res
          .status(409)
          .json(
            new apiError(
              false,
              409,
              null,
              "This email is already registered. We have resent the OTP to your email. Please verify your account.",
              true
            )
          );
      } else {
        // User exists and is verified. Inform them to log in.
        return res
          .status(409)
          .json(
            new apiError(
              false,
              409,
              null,
              "This email is already registered. Please log in.",
              true
            )
          );
      }
    }

    // Hash the password
    const HashPass = await makeHashPassword(password);

    // Generate a new OTP and determine its expiration time (10 minutes from now)
    const newOtp = await numbergenertor();
    const otpExpireTime = Date.now() + 10 * 60 * 1000;

    // Send OTP email
    const emailSent = await sendMail(email, newOtp);
    if (!emailSent) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "Unable to send OTP email. Please try again.",
            true
          )
        );
    }

    // Create and save the new user document
    const newUser = new userModel({
      firstName,
      email,
      mobile,
      password: HashPass,
      Otp: newOtp,
      otpExpire: otpExpireTime,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    return res
      .status(201)
      .json(
        new apiResponse(
          true,
          savedUser,
          "Email sent to user and data saved",
          false
        )
      );
  } catch (error) {
    return res
      .status(505)
      .json(
        new apiError(false, 505, null, `Registration failed: ${error}`, true)
      );
  }
};

const OtpVerify = async (req, res) => {
  try {
    const { email, Otp } = req.body;
    if (!email || !Otp) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Otp credentials missing", true));
    }

    // Check if user exists by email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "User not found", true));
    }

    // Verify OTP and check if it's still valid
    if (user.Otp == parseInt(Otp) && new Date().getTime() <= user.otpExpire) {
      // OTP is correct and valid then update the user
      user.Otp = null;
      user.otpExpire = null;
      user.isVerified = true;
      await user.save();

      // removing pass and otp from response
      const userData = user.toObject();
      delete userData.password;
      delete userData.Otp;

      return res
        .status(201)
        .json(
          new apiResponse(true, userData, "Otp verification successful", false)
        );
    } else {
      // OTP is invalid or expired; return error
      user.Otp = null;
      user.otpExpire = null;
      await user.save();

      return res
        .status(401)
        .json(new apiError(false, 401, null, "Otp expired or mismatch", true));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new apiError(
          false,
          404,
          null,
          "Otp verification failed from Controller",
          true
        )
      );
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res
        .status(404)
        .json(
          new apiError(false, 404, null, `Otp resend User not found`, true)
        );
    }

    if (findUser.isVerified === true) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, `User is already verified`, true));
    }

    // Making Otp Time limit
    const otpExpireTime = new Date().getTime() + 10 * 60 * 1000;
    // gen Otp
    const ResendOtpGen = await numbergenertor();
    findUser.Otp = ResendOtpGen;
    // sending email with new otp
    const emailSentNewOtp = await sendMail(email, ResendOtpGen, "Resend Opt");
    if (emailSentNewOtp) {
      findUser.Otp = ResendOtpGen;
      findUser.otpExpire = otpExpireTime;
      await findUser.save();

      return res
        .status(201)
        .json(
          new apiResponse(true, findUser, "Resent otp successfully", false)
        );
    }
    return res
      .status(401)
      .json(
        new apiError(false, 401, null, `Otp resend failed try again`, true)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `Otp resend Controller ${error}`, true)
      );
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
    if (!loggedUser) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "User not found", true));
    }
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
  resendOtp,
};
