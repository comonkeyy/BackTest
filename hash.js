const bcrypt = require("bcrypt");
bcrypt.hash("owner1", 10, (err, hash) => {
  if (err) throw err;
  console.log(hash);
});
