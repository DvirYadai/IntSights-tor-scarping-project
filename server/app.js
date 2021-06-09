const express = require("express");
const app = express();
const cors = require("cors");
const postsRoute = require("./routes/postsRoute");
const userRoute = require("./routes/userRoute");
const cron = require("node-cron");
const scraper = require("./utils/utils");
const axios = require("axios");

app.use(cors());
app.use(express.json());

app.use("/api/v1", postsRoute);
app.use("/api/v1", userRoute);

app.get("/test", async (req, res) => {
  const response = await axios.get("http://nzxj65x32vh2fkhk.onion/all", {
    proxy: {
      host: "localhost",
      port: 8118,
    },
  });
  res.send(response.data);
});

const scrapeTask = cron.schedule("*/2 * * * *", scraper, {
  scheduled: false,
});

scrapeTask.start();

module.exports = app;
