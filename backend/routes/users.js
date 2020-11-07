const router = require("express").Router();
const bcrypt = require("bcryptjs");
const conn = require("../config/conn");
const axios = require("axios");
const config = require("config");

// @route POST /api/user/register
// @desc Register a new user
router.post("/register", (req, res) => {

  // get phone number, password, last name and first name via request
  const { phone_number, pass, last_name, first_name } = req.body;
  if (!(phone_number && pass && first_name && last_name)) {
    return res.status(400).json({ msg: "Please enter all details" });
  }
  try {
    conn.query(

      // select user with the entered phone number
      `SELECT * FROM users WHERE phone_number="${phone_number}"`,
      (err, result) => {
        if (err) throw err;

        // if user with that phone number already exists
        if (result.length !== 0) {
          return res.status(400).json({ msg: "User already exists" });
        }

        // else add that user in the users table
        else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(pass, salt, (err, hash) => {
              if (err) throw err;
              conn.query(
                `INSERT INTO users (phone_number, pass, first_name, last_name ) VALUES ("${phone_number}", "${hash}", "${first_name}","${last_name}");`,
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

  // get user ID via request
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Did not receive ID." });
  }
  try {
    conn.query(

      // select user with the entered ID
      `SELECT * FROM users WHERE phone_number=${id}`,
      (err, result) => {
        if (err) throw err;

        // if user with that ID doesn't exist
        if (!result.length) {
          return res.status(400).json({ msg: "User does not exist" });
        }

        // else return ID, user name
        else {
          return res.json({
            id: id,
            user_name: result[0].user_name,
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

  // get ID of member and group name via request
  const { phone_number: id, group } = req.body;
  let gid = new Date().getTime();
  gid = gid.toString();
  gid = parseInt(gid.substring(gid.length - 9));
  console.log(gid);
  if (!id || !group) {
    return res.status(400).json({ msg: "Did not receive ID or group number" });
  }
  try {
    conn.query(

      // select user with the entered ID
      `SELECT * FROM users WHERE phone_number="${id}"`,
      (err, result) => {
        if (err) throw err;

        // if user with that phone number doesn't exist
        if (result.length === 0) {
          return res.status(400).json({ msg: "User Doesn't Exist" });
        }
        conn.query(

          // select group with the group name
          `SELECT * FROM chat_groups WHERE group_name="${group}"`,
          (err, result) => {
            if (err) throw err;

            // if group name already exists
            if (result.length !== 0) {
              return res.status(400).json({ msg: "Group Name Already Exists" });
            }

            // else add that group in the chat_groups table
            else {
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
// @desc Join Group
router.post("/join-group", (req, res) => {

  // get ID of member and group name via request
  const { phone_number: id, group } = req.body;
  let gid = null;
  if (!id || !group) {
    return res.status(400).json({ msg: "Did not receive ID. or group number" });
  }
  try {
    conn.query(

      // select user with the entered ID
      `SELECT * FROM users WHERE phone_number="${id}"`,
      (err, result) => {
        if (err) throw err;

        // if user with that phone number doesn't exist
        if (result.length === 0) {
          return res.status(400).json({ msg: "User Doesn't Exist" });
        }
        conn.query(

          // select group with the group name
          `SELECT * FROM chat_groups WHERE group_name="${group}"`,
          (err, result) => {
            if (err) throw err;

            // if group name doesn't exist
            if (result.length === 0) {
              return res.status(400).json({ msg: "Group Name Doesn't Exist" });
            }

            // else check if user already present in the group or not
            else {
              gid = result[0].groupID;
              conn.query(

                // select user with the entered ID and group name
                `SELECT * FROM chat_groups WHERE group_name="${group}" AND members="${id}"`,
                (err, result) => {
                  if (err) throw err;

                  // if user already present in the group
                  if (result.length !== 0) {
                    return res.status(400).json({
                      msg:
                        "You are already present in this group, proceed to sign-in",
                    });
                  }

                  // else add that user to the chat_groups table
                  else {
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

  // get user ID, password and group via request
  const { phone_number: id, pass, group } = req.body;
  console.log(req.body);
  if (!id) {
    return res
      .status(400)
      .json({ msg: "Did not receive User ID/Phone Number" });
  }
  try {
    conn.query(

      // select user with the entered ID and group name
      `SELECT * FROM chat_groups WHERE members="${id}" AND group_name="${group}"`,
      (err, result) => {
        if (err) throw err;

        // if the user is not a member of the group or the group doesn't exist
        if (!result.length) {
          return res.status(400).json({
            msg: "You are not member of this group or group doesn't exist",
          });
        }

        // else
        else {
          conn.query(
            `SELECT * FROM users WHERE phone_number="${id}"`,
            (err, result) => {
              if (err) throw err;

              // if user with that phone number doesn't exist
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
