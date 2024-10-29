const bcrypt = require("bcrypt");

const makeHashPassword = async (PlaintextPassword) => {
  try {
    return bcrypt.hash(PlaintextPassword, 10);
  } catch (error) {
    console.log("failed to hash password", error);
  }
};

module.exports = { makeHashPassword };
