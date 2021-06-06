const axios = require("axios");
const cheerio = require("cheerio");
const addPost = require("../utils/utils");

module.exports.data_get = async (req, res) => {
  try {
    const posts = [];
    const bodies = [];
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
      posts[i].body = $(e).children().text().replace(/\s\s+/g, " ");
    });
    await addPost(posts);
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};
