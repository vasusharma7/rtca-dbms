const express = require("express");
const cors = require("cors");
const path = require("path");
const socket = require("socket.io");
const convert = require("atob");
const axios = require("axios");
const fs = require("fs");
const { saveMessage } = require("./main.js");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));
const http = require("http").Server(app);

app.get("/", (req, res) => res.send("Hello World!"));
const port =5001;
// const usersRouter = require("./routes/users");
const routes = ["users", "chat"];
routes.forEach((route) =>
  app.use(`/api/${route}`, require(`./routes/${route}`))
);

http.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});

const io = socket(http);

const activeUsers = new Set();
io.on("connection", function(socket) {
  console.log("Made socket connection");

  socket.on("new user", function(data) {
    socket.userId = data;
    activeUsers.add(data);
    console.log(activeUsers);
    io.emit("new user", [...activeUsers]);
  });
  socket.on("new message", (data) => {
    io.emit("new message", data);
    saveMessage(data);
  });
  socket.on("new image", (data) => {
    io.emit("new image", data.image);
    let image = data.image.base64.replace(/^data:image\/\w+;base64,/, "");
    let fileName = new Date().getTime().toString() + data.image.name.toString();
    fs.writeFileSync(
      "./public/images/" + fileName,
      image,
      { encoding: "base64" },
      function(err) {}
    );
    data["image"] = "images/" + fileName;
    io.emit("new message", data);
    saveMessage(data);
  });
  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
});
