const mongoose = require("mongoose");
require("dotenv").config();
const chalk = require("chalk");
const { dbName } = require("../Constant/Constent");

const dbConnect = async () => {
  try {
    const dbconnectionInstense = await mongoose.connect(
      //  when use "/" here no spaces need here, if you set space code will not going to run
      `${process.env.MONGODB_DATABASE_URL}/${dbName}`
    );
  } catch (error) {
    console.log(chalk.bgRed("Connection error"), error);
  }
};

module.exports = { dbConnect };
