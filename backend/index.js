const express = require("express");
const cors = require("cors");

const socket = require("socket.io");
const axios = require("axios");
const { saveMessage } = require("./main.js");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.options("*", cors());
const http = require("http").Server(app);

app.get("/", (req, res) => res.send("Hello World!"));
const port = process.env.PORT || 5000;
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
  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
});
