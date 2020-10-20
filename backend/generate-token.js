const bcrypt = require('bcryptjs');
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash('1', salt, (err, hash) => {
    if (err) throw err;
    console.log(hash);
  });
});
