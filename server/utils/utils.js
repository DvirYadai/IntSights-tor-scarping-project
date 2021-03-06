const Post = require("../modules/post-schema");
const User = require("../modules/user-schema");
const axios = require("axios");
const cheerio = require("cheerio");

const addPost = async (postArr) => {
  let count = 0;
  const newPosts = [];
  for (const post of postArr) {
    const isExist = await Post.find({ body: post.body, title: post.title });
    if (isExist.length === 0) {
      newPosts.push(post);
      count++;
      try {
        await Post.create(post);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return { count, newPosts };
};

const scraper = async () => {
  try {
    const posts = [];
    const response = await axios.get("http://nzxj65x32vh2fkhk.onion/all", {
      proxy: {
        host: "localhost",
        port: 8118,
      },
    });
    const $ = cheerio.load(response.data);
    const titlesNode = $(".col-sm-5");
    titlesNode.each((i, e) => {
      posts.push({ title: $(e).children("h4").text().slice(14).slice(0, -12) });
    });
    const authorAndDateNode = $("div[class=col-sm-6]:not(.text-right)");
    authorAndDateNode.each((i, e) => {
      let author = $(e).text().slice(21).slice(0, -34);
      if (
        author === "Anonymous" ||
        author === "Unknown" ||
        author === "Guest"
      ) {
        author = "Anonymous";
      }
      posts[i].author = author;
      posts[i].date = $(e).text().slice(34).slice(0, -9);
    });
    const bodyNode = $("ol");
    bodyNode.each((i, e) => {
      posts[i].body = $(e).text().replace(/\s\s+/g, " ");
    });
    const { count, newPosts } = await addPost(posts);
    io.sockets.emit("scraperUpdate", {
      message: `Data collection from a source completed successfully, there are ${count} new posts`,
      newPostsCount: count,
      newPosts,
    });
  } catch (error) {
    console.log(error);
    io.sockets.emit("scraperUpdate", {
      message: "Data collection from a source has failed",
    });
  }
};

module.exports = scraper;
