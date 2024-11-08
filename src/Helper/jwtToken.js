const jwt = require("jsonwebtoken");

const makeJWTToken = async (userinfo) => {
  try {
    const token = await jwt.sign(
      {
        ...userinfo,
      },
      process.env.TOKEN_SECRAT,
      { expiresIn: process.env.TOKEN_EXPIRY_DATE }
    );
    return token;
  } catch (error) {
    console.log("error from token", error);
  }
};

module.exports = { makeJWTToken };
