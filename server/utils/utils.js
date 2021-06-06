const Post = require("../modules/post-schema");

const addPost = async (postArr) => {
  for (const post of postArr) {
    const isExist = await Post.find({ body: post.body, title: post.title });
    if (isExist.length === 0) {
      try {
        await Post.create(post);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

module.exports = addPost;
