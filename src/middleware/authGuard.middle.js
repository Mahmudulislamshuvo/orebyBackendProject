const jwt = require("jsonwebtoken");
const { apiError } = require("../Utils/apiError");

const authGuard = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (token || req.headers.authorization) {
      const decoded = await jwt.verify(
        token || req.headers.authorization,
        process.env.TOKEN_SECRET
      );

      if (decoded) {
        const user = {
          userId: decoded.id,
          useremail: decoded.email,
        };
        req.user = user;
        return next();
      }
    } else {
      // No token provided; send unauthorized response.
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "Unauthorized access: No token provided",
            true
          )
        );
    }
  } catch (error) {
    console.log("error from authguard", error);
    return res
      .status(401)
      .json(
        new apiError(
          false,
          401,
          null,
          `Unauthorized access: ${error.message}`,
          true
        )
      );
  }
};

module.exports = { authGuard };
