const Post = require("../modules/post-schema");

module.exports.posts_get = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
