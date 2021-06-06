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
    return res.status(500).send(error.message);
  }
};
