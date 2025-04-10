const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");
const { PasswordChecker, UsernameChecker } = require("../Helper/validator");
const adminSchema = require("../Model/admin.model");
const { makeHashPassword, comparePassword } = require("../Helper/bcrypt");
const { makeJWTToken } = require("../Helper/jwtToken");

const createAdmin = async (req, res) => {
  try {
    const { username, password, terms, confirmpassword } = req.body;

    if (!username || !password || !terms || !confirmpassword) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "Please fill all fields", true));
    }
    if (!UsernameChecker(username)) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "Invalid username", true));
    }

    const userAlreadyExist = await adminSchema.findOne({ username: username });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "username already exist", true));
    }
    if (password !== confirmpassword) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "password mismatch", true));
    }
    if (PasswordChecker(password) === false) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "Invalid password", true));
    }
    const hashedPassword = await makeHashPassword(password);

    const newAdmin = new adminSchema({
      username,
      password: hashedPassword,
    });
    await newAdmin.save();

    return res
      .status(201)
      .json(
        new apiResponse(true, newAdmin, "Admin created successfully", false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(false, 500, null, error.message, true));
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json(new apiError(false, 400, null, "Please fill all fields", true));
    }
    const user = await adminSchema.findOne({ username: username });
    if (!user) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "User not found", true));
    }
    const isPasswordValid = await comparePassword(password, user?.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Invalid password", true));
    }

    const TokenPayload = {
      id: user._id,
      username: user.username,
    };

    const token = await makeJWTToken(TokenPayload);
    if (token) {
      return res
        .status(200)
        .cookie("admintoken", token, { httpOnly: true, secure: true })
        .json(
          new apiResponse(
            true,
            {
              token: token,
              username: user.username,
              userId: user._id,
            },
            "Login seccessfull with token",
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(false, 500, null, error.message, true));
  }
};

module.exports = { createAdmin, adminLogin };
