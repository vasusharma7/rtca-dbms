const axios = require("axios");
const config = require("config");
const saveMessage = (data) => {
  console.log(`${config.get("backendURL")}/chat/saveMessage`);
  try {
    axios.post(`${config.get("backendURL")}/chat/saveMessage`, data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { saveMessage };
