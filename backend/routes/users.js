const router = require("express").Router();
const bcrypt = require("bcryptjs");
const conn = require("../config/conn");

// @route POST /api/user/register
// @desc Register a new user
router.post("/register", (req, res) => {
  const { phone_number, pass, last_name, first_name } = req.body;
  if (!(phone_number && pass && first_name && last_name)) {
    return res.status(400).json({ msg: "Please enter all details" });
  }
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
});

// @route GET /api/user/
// @desc Retrieve user details
router.get("/getData/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Did not receive ID." });
  }
  conn.query(`SELECT * FROM users WHERE phone_number=${id}`, (err, result) => {
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
  });
});

// @route GET /api/user/login
// @desc Retrieve user details
router.post("/login", (req, res) => {
  const { phone_number: id, pass } = req.body;
  console.log(req.body);
  if (!id) {
    return res
      .status(400)
      .json({ msg: "Did not receive User ID/Phone Number" });
  }

  conn.query(`SELECT * FROM users WHERE phone_number=${id}`, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      return res.status(400).json({ msg: "User does not exist" });
    } else {
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
  });
});

module.exports = router;
