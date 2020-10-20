const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));
const port = process.env.PORT || 5000;
// const usersRouter = require("./routes/users");

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
