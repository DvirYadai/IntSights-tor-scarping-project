const express = require("express");
const app = express();
const cors = require("cors");
const postsRoute = require("./routes/postsRoute");
const userRoute = require("./routes/userRoute");
const cron = require("node-cron");
const scraper = require("./utils/utils");

app.use(cors());
app.use(express.json());

app.use("/api/v1", postsRoute);
app.use("/api/v1", userRoute);

const scrapeTask = cron.schedule("*/2 * * * *", scraper, {
  scheduled: false,
});

scrapeTask.start();

module.exports = app;
