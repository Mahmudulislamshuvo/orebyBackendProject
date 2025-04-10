const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate secure random secret (run once and store in .env)
// const generateSecret = () => crypto.randomBytes(64).toString('hex');

const tokenService = {
  generateAccessToken: (user) => {
    const payload = {
      sub: user._id,
      role: user.role,
      iss: "your-app-name",
      aud: "your-app-client",
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
      algorithm: "HS512",
    });
  },

  generateRefreshToken: (user) => {
    const payload = {
      sub: user._id,
      jti: crypto.randomBytes(16).toString("hex"),
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
      algorithm: "HS512",
    });
  },

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        algorithms: ["HS512"],
        issuer: "your-app-name",
        audience: "your-app-client",
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new Error("Token expired");
      }
      if (err.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      }
      throw err;
    }
  },

  storeRefreshToken: async (userId, token) => {
    // Implement your database storage logic here
    // Consider using a separate refresh token collection
  },

  generateTokens: async (user) => {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.storeRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || 900, // 15 minutes in seconds
    };
  },
};

module.exports = tokenService;
