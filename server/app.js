const express = require("express");
const app = express();
const cors = require("cors");
const dataRoute = require("./routes/dataRoute");
const postsRoute = require("./routes/postsRoute");
const userRoute = require("./routes/userRoute");

app.use(cors());
app.use(express.json());

app.use("/api/v1", dataRoute);
app.use("/api/v1", postsRoute);
app.use("/api/v1", userRoute);

module.exports = app;
