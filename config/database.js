const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

exports.connectDatabase = (app) => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database...");
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
