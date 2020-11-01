const router = require("express").Router();
const conn = require("../config/conn");

// @route GET /api/chat/
// @desc Retrieve contacts
router.get("/users/:id/:group", (req, res) => {
  const { id, group } = req.params;
  console.log("users", id, group);
  if (!id || !group) {
    return res.status(400).json({ msg: "Invalid User Id" });
  }
  conn.query(
    `SELECT chat_groups.groupID,users.phone_number,users.first_name,users.last_name from users inner join chat_groups on chat_groups.members = users.phone_number WHERE group_name="${group}"`,
    (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (!result.length) {
        return res.status(400).json({ msg: "No Users Found" });
      } else {
        let data = [];
        let groupID = "";
        result.forEach((record) => {
          groupID = record.groupID;
          // if (record.phone_number == id) return;
          data.push({
            id: record.phone_number,
            first_name: record.first_name,
            last_name: record.last_name,
          });
        });
        data = [
          {
            id: groupID,
            first_name: group,
            last_name: "",
            group: true,
          },
          ...data,
        ];
        data.push();
        console.log(data);
        return res.status(200).json([...data]);
      }
    }
  );
});

router.post("/userMessages", (req, res) => {
  console.log("messages", req.body);
  let { id, user, group, dm } = req.body;
  if (!id || !user) {
    return res.status(400).json({ msg: "Invalid User ID" });
  }
  let group_user_message = dm === true ? 0 : 1;
  let query = "";
  if (group_user_message) {
    query = `SELECT contents.file_as_blob,contents.message_content,messages.date_time,messages.phone_number,messages.userID FROM messages inner join messageContent as contents on messages.messageID = contents.messageID where messages.groupID="${group}" AND messages.group_user_message=${group_user_message} order by messages.date_time;`;
  } else {
    query = `SELECT contents.file_as_blob,contents.message_content,messages.date_time,messages.phone_number,messages.userID FROM messages inner join messageContent as contents on messages.messageID = contents.messageID where ((messages.phone_number="${id}" and messages.userID = "${user}") or (messages.phone_number = "${user}" and messages.userID = "${id}")) and messages.groupID="${group}" AND messages.group_user_message=${group_user_message} order by messages.date_time;`;
  }
  console.log(query);
  conn.query(query, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    const data = [];
    result.forEach((record, key) => {
      data.push({
        id: key + 1,
        author: record.phone_number,
        message: record.message_content,
        image: record.file_as_blob,
        timestamp: record.date_time,
      });
    });
    return res.status(200).json([...data]);
  });
});
router.post("/saveMessage", (req, res) => {
  let { from, to, message, id, dm, group, image } = req.body;
  console.log("save", req.body);
  id = id.toString();
  id = parseInt(id.substring(id.length - 9));
  const time = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  let query = "";

  if (dm) {
    query = `INSERT INTO messages (messageID,phone_number,date_time,group_user_message,userID,groupID) VALUES ("${id}","${from}", "${time}", 0,"${to}","${group}");`;
  } else {
    query = `INSERT INTO messages (messageID,phone_number,date_time,group_user_message,userID,groupID) VALUES ("${id}","${from}", "${time}", 1,"${from}","${to}");`;
  }
  try {
    conn.query(query, (err, result) => {
      if (err) {
        console.log(err);
      }
      let query = "";
      if (image) {
        query = `INSERT INTO messageContent (messageID,message_content,file_as_blob) VALUES ("${id}","${message}","${image}");`;
      } else {
        query = `INSERT INTO messageContent (messageID,message_content) VALUES ("${id}","${message}");`;
      }

      conn.query(query, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("message saved successfully");
        return res.status(200).json("Message Saved Successfully");
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});
module.exports = router;
