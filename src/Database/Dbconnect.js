const mongoose = require("mongoose");
require("dotenv").config();
const chalk = require("chalk");

const dbConnect = async () => {
  try {
    const dbconnectionInstense = await mongoose.connect(
      process.env.MONGODB_DATABASE_URL || ""
      //   there is big problem with upper code ---|| ""--- I lost two days with it.
    );
  } catch (error) {
    console.log(chalk.bgRed("Connection error"), error);
  }
};

module.exports = { dbConnect };
