const Post = require("../modules/post-schema");

module.exports.posts_get = async (req, res) => {
  try {
    const posts = await Post.find({});
    posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
