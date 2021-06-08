const app = require("./app");
const mongoose = require("mongoose");
const server = require("http").createServer(app);
global.io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
const { keywordsSearch } = require("./utils/utils");
const cron = require("node-cron");

io.on("connection", (socket) => {
  console.log(socket.id);
  let searchTask;
  socket.on("keywordsSearch", (data) => {
    console.log("keywordsSearch");
    if (searchTask !== undefined) {
      searchTask.stop();
    }
    searchTask = cron.schedule(
      `*/${data.interval} * * * *`,
      () => {
        keywordsSearch(data.keywords, socket.id);
      },
      {
        scheduled: false,
      }
    );
    searchTask.start();
  });
  socket.on("endSearchTask", () => {
    if (searchTask !== undefined) {
      searchTask.stop();
    }
  });
  socket.on("disconnect", () => {
    if (searchTask) {
      searchTask.stop();
    }
    console.log(`user has disconnected`);
  });
});

server.listen(3001, () => {
  mongoose
    .connect("mongodb://localhost:27017/TorScrapingDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("mongodb connected");
    })
    .catch(() => {
      console.log("there was a problem connecting to mongodb");
    });
  console.log("app is listening on port 3001");
});

module.exports = io;
