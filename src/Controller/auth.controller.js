const { apiResponse } = require("../Utils/apiResponse");
const { apiError } = require("../Utils/apiError");

const Registration = async (req, res) => {
  try {
    return res.status(200).json(new apiResponse(true, null, "working", false));
  } catch (error) {
    return res
      .status(505)
      .json(new apiError(false, null, "Registration failed", true));
  }
};

module.exports = { Registration };
