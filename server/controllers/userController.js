const User = require("../modules/user-schema");

module.exports.user_post = async (req, res) => {
  const { uid, username, email, userImg } = req.body;
  try {
    const isExist = await User.find({ email: email });
    if (isExist.length === 0) {
      const user = await User.create({ uid, username, email, userImg });
      return res.status(200).send({ message: "success" });
    } else {
      return res.status(200).send({ message: "success" });
    }
  } catch (error) {
    return res.status(500).send({ message: "there was an error" });
  }
};

module.exports.user_get = async (req, res) => {
  const { uid } = req.query;
  try {
    const user = await User.findOne({ uid: uid });
    return res.status(200).json({
      keywords: user.keywords,
      searchInterval: user.searchInterval,
    });
  } catch (error) {
    return res.status(500).send({ message: "there was an error" });
  }
};

module.exports.user_update = async (req, res) => {
  const { words, interval, uid } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { keywords: words, searchInterval: interval } },
      { new: true },
      (err, doc) => {
        if (err) {
          return res.status(500).send({ message: "there was an error" });
        }
        return res.status(200).send({ message: "success" });
      }
    );
  } catch (error) {
    return res.status(500).send({ message: "there was an error" });
  }
};
