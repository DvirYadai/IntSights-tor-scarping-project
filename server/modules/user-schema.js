const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: String,
  username: String,
  email: {
    type: String,
    unique: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
  searchInterval: {
    type: Number,
    default: 5,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
