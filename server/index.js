const app = require("./app");
const mongoose = require("mongoose");

app.listen(3001, () => {
  mongoose
    .connect("mongodb://localhost:27017/TorScrapingDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("mongodb connected");
    })
    .catch(() => {
      console.log("there was a problem connecting to mongodb");
    });
  console.log("app is listening on port 3001");
});
