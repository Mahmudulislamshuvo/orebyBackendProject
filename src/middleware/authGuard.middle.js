const jwt = require("jsonwebtoken");
const { apiError } = require("../Utils/apiError");

const authGuard = async (req, res, next) => {
  try {
    let token;
    // Check if the token is present in cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // Check if the token is present in the Authorization header without Bearar
    else if (req.headers.authorization) {
      token = req.headers.authorization.trim();
    }

    if (!token) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "No token provided. Unauthorized access.",
            true
          )
        );
    }

    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);

    // If decoded successfully, set user info in req.user
    if (decoded) {
      req.user = {
        userId: decoded.id,
        useremail: decoded.email,
        token: token,
      };
      return next();
    } else {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "Invalid or expired token.", true)
        );
    }
  } catch (error) {
    console.error("JWT Token verification failed", error);
    return res.status(401).json({
      success: false,
      message: "Token verification failed. Unauthorized access.",
    });
  }
};

module.exports = { authGuard };

// todo: Using const here
// const authGuard = async (req, res, next) => {
//   try {
//     // Use const and assign token in a single statement
//     const token =
//       req.cookies.token ||
//       (req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//         ? req.headers.authorization.replace("Bearer", "").trim()
//         : null);

//     // If no token is found
//     if (!token) {
//       return res
//         .status(401)
//         .json(
//           new apiError(
//             false,
//             401,
//             null,
//             "No token provided. Unauthorized access.",
//             true
//           )
//         );
//     }

//     // Verify the token
//     const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);

//     // If decoded successfully, set user info in req.user
//     if (decoded) {
//       req.user = {
//         userId: decoded.id,
//         useremail: decoded.email,
//         token: token,
//       };
//       return next();
//     } else {
//       return res
//         .status(401)
//         .json(
//           new apiError(false, 401, null, "Invalid or expired token.", true)
//         );
//     }
//   } catch (error) {
//     console.error("JWT Token verification failed", error);
//     return res.status(401).json({
//       success: false,
//       message: "Token verification failed. Unauthorized access.",
//     });
//   }
// };
