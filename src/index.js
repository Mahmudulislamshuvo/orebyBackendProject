require("dotenv").config();
const { dbConnect } = require("./Database/Dbconnect");
const { app } = require("./app.js");

dbConnect()
  .then(() => {
    console.log("Database Connection Succesfull");
    app.get("/shuvo", (req, res) => {
      console.log("hi Shuvo");
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("connection error from index", err);
  });
