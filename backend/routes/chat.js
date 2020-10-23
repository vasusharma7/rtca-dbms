const router = require("express").Router();
const conn = require("../config/conn");

// @route GET /api/chat/
// @desc Retrieve contacts
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  console.log("users", id);
  if (!id) {
    return res.status(400).json({ msg: "Invalid User Id" });
  }
  conn.query(`SELECT * FROM users`, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    if (!result.length) {
      return res.status(400).json({ msg: "No Users Found" });
    } else {
      const data = [];
      result.forEach((record) => {
        if (record.phone_number == id) return;
        data.push({
          id: record.phone_number,
          first_name: record.first_name,
          last_name: record.last_name,
        });
      });
      return res.status(200).json([...data]);
    }
  });
});

router.get("/userMessages/:id/:user", (req, res) => {
  const { id, user } = req.params;
  console.log("messages", id, user);
  if (!id || !user) {
    return res.status(400).json({ msg: "Invalid User ID" });
  }
  const query = `SELECT contents.message_content,messages.date_time,messages.phone_number,messages.userID FROM messages inner join messageContent as contents on messages.messageID = contents.messageID where group_user_message = 0 and ((messages.phone_number="${id}" and messages.userID = "${user}") or (messages.phone_number = "${user}" and messages.userID = "${id}")) order by messages.date_time`;
  conn.query(query, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    // console.log(result);
    const data = [];
    result.forEach((record, key) => {
      data.push({
        id: key + 1,
        author: record.phone_number,
        message: record.message_content,
        timestamp: record.date_time,
      });
    });
    return res.status(200).json([...data]);
  });
});
router.post("/saveMessage", (req, res) => {
  let { from, to, message, id, dm } = req.body;
  console.log(from, to);
  id = id.toString();
  id = parseInt(id.substring(id.length - 9));
  const time = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  let query = "";
  if (dm) {
    query = `INSERT INTO messages (messageID,phone_number,date_time,group_user_message,userID) VALUES ("${id}","${from}", "${time}", 0,"${to}");`;
  } else {
    query = `INSERT INTO messages (messageID,phone_number,date_time,group_user_message,groupID) VALUES ("${id}","${from}", "${time}", 1,,"${to}");`;
  }
  try {
    conn.query(query, (err, result) => {
      if (err) {
        console.log(err);
      }
      conn.query(
        `INSERT INTO messageContent (messageID,message_content) VALUES ("${id}","${message}");`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("message saved successfully");
          return res.status(200).json("Message Saved Successfully");
        }
      );
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
module.exports = router;
