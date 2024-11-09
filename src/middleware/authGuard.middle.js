const jwt = require("jsonwebtoken");
const { apiError } = require("../Utils/apiError");

const authGuard = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (token || req.headers.authorization) {
      const decoded = await jwt.verify(
        token || req.headers.authorization,
        process.env.TOKEN_SECRAT
      );

      if (decoded) {
        const user = {
          userId: decoded.id,
          useremail: decoded.email,
        };
        req.user = user;
        next();
      }
    } else {
      return res
        .status(404)
        .json(
          new apiError(false, 402, null, `unathorize access: ${error}`, true)
        );
    }
  } catch (error) {
    console.log("error from authguard", error);
  }
};

module.exports = { authGuard };
