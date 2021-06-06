const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: String,
  body: String,
});

module.exports = mongoose.model("Post", postSchema);
