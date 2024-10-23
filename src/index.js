require("dotenv").config();
const { dbConnect } = require("./Database/Dbconnect");
const { app } = require("./app.js");
const chalk = require("chalk");

dbConnect()
  .then(() => {
    console.log(chalk.bgBlue("Database Connection Succesfull"));
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(
        chalk.rgb(255, 221, 51)("Yellow"),
        chalk.rgb(0, 204, 204)("little blue"),
        chalk.rgb(204, 153, 255)("purple with little pink"),
        chalk.rgb(255, 136, 51)("orange"),
        chalk.rgb(102, 255, 153)("light green"),
        chalk.rgb(255, 85, 136)("dark pink"),
        chalk.rgb(255, 51, 51)("red"),
        chalk.rgb(51, 153, 255)("dark blue"),
        chalk.bgGreen(`Server is running on http://localhost:${port}`)
      );
    });
  })
  .catch((err) => {
    console.log(chalk.bgRed("connection error from index"), err);
  });
