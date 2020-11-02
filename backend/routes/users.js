const router = require("express").Router();
const bcrypt = require("bcryptjs");
const conn = require("../config/conn");
const axios = require("axios");
const config = require("config");
// @route POST /api/user/register
// @desc Register a new user
router.post("/register", (req, res) => {
  const { phone_number, pass, last_name, first_name } = req.body;
  if (!(phone_number && pass && first_name && last_name)) {
    return res.status(400).json({ msg: "Please enter all details" });
  }
  try {
    conn.query(
      `SELECT * FROM users WHERE phone_number="${phone_number}"`,
      (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
          return res.status(400).json({ msg: "User already exists" });
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(pass, salt, (err, hash) => {
              if (err) throw err;
              conn.query(
                `INSERT INTO users (phone_number, pass,first_name,last_name ) VALUES ("${phone_number}", "${hash}", "${first_name}","${last_name}");`,
                (err, result) => {
                  if (err) throw err;
                  return res.status(200).json("Success! User created");
                }
              );
            });
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error ! Something went wrong");
  }
});

// @route GET /api/user/
// @desc Retrieve user details
router.get("/getData/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Did not receive ID." });
  }
  try {
    conn.query(
      `SELECT * FROM users WHERE phone_number=${id}`,
      (err, result) => {
        if (err) throw err;
        if (!result.length) {
          return res.status(400).json({ msg: "User does not exist" });
        } else {
          return res.json({
            id: id,
            user_name: result[0].user_name,
            email_id: result[0].email_id,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error ! Something went wrong");
  }
});

// @route GET /api/user/
// @desc Make Group
router.post("/make-group", (req, res) => {
  const { phone_number: id, group } = req.body;
  let gid = new Date().getTime();
  gid = gid.toString();
  gid = parseInt(gid.substring(gid.length - 9));
  console.log(gid);
  if (!id || !group) {
    return res.status(400).json({ msg: "Did not receive ID. or group number" });
  }
  try {
    conn.query(
      `SELECT * FROM users WHERE phone_number="${id}"`,
      (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          return res.status(400).json({ msg: "User Doesn't Exist" });
        }
        conn.query(
          `SELECT * FROM chat_groups WHERE group_name="${group}"`,
          (err, result) => {
            if (err) throw err;
            if (result.length !== 0) {
              return res.status(400).json({ msg: "Group Name Already Exists" });
            } else {
              if (err) throw err;
              conn.query(
                `INSERT INTO chat_groups (groupID,group_name,members) VALUES ("${gid}","${group}","${id}")`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(400)
                      .json({ msg: "Something Went Wrong" });
                  }
                  // axios.post(`${config.get("backendURL")}/users/register`, {phone_number});
                  return res
                    .status(200)
                    .json({ msg: "Group Created Successfully" });
                }
              );
            }
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error ! Something went wrong");
  }
});

// @route GET /api/user/
// @desc Join
router.post("/join-group", (req, res) => {
  const { phone_number: id, group } = req.body;
  let gid = null;
  if (!id || !group) {
    return res.status(400).json({ msg: "Did not receive ID. or group number" });
  }
  try {
    conn.query(
      `SELECT * FROM users WHERE phone_number="${id}"`,
      (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          return res.status(400).json({ msg: "User Doesn't Exist" });
        }
        conn.query(
          `SELECT * FROM chat_groups WHERE group_name="${group}"`,
          (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
              return res.status(400).json({ msg: "Group Name Doesn't Exist" });
            } else {
              gid = result[0].groupID;
              conn.query(
                `SELECT * FROM chat_groups WHERE group_name="${group}" AND members="${id}"`,
                (err, result) => {
                  if (err) throw err;
                  if (result.length !== 0) {
                    return res.status(400).json({
                      msg:
                        "You are already present in this group, proceed to sign-in",
                    });
                  } else {
                    conn.query(
                      `INSERT INTO chat_groups (groupID,group_name,members) VALUES ("${gid}","${group}","${id}")`,
                      (err, result) => {
                        if (err) {
                          console.log(err);
                          return res
                            .status(400)
                            .json({ msg: "Something Went Wrong" });
                        }
                        return res
                          .status(200)
                          .json({ msg: "Group Created Successfully" });
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error ! Something went wrong");
  }
});

// @route GET /api/user/login
// @desc Retrieve user details
router.post("/login", (req, res) => {
  const { phone_number: id, pass, group } = req.body;
  console.log(req.body);
  if (!id) {
    return res
      .status(400)
      .json({ msg: "Did not receive User ID/Phone Number" });
  }
  try {
    conn.query(
      `SELECT * FROM chat_groups WHERE members="${id}" AND group_name="${group}"`,
      (err, result) => {
        if (err) throw err;
        if (!result.length) {
          return res.status(400).json({
            msg: "You are not member of this group or group doesn't exist",
          });
        } else {
          conn.query(
            `SELECT * FROM users WHERE phone_number="${id}"`,
            (err, result) => {
              if (err) throw err;
              if (result.length === 0) {
                return res.status(400).json({ msg: "User Doesn't Exist" });
              }
              bcrypt.compare(pass, result[0].pass, (err, result) => {
                if (err) {
                  throw err;
                }
                if (result) {
                  return res.status(200).json({ msg: "Success LoggedIn" });
                } else {
                  return res.status(400).json({ msg: "Password incorrect" });
                }
              });
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error ! Something went wrong");
  }
});

module.exports = router;
