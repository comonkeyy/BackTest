const db = require("../config/db");

module.exports = {
  create: (title, content, adminId, callback) => {
    db.query(
      `INSERT INTO notices (title, content, admin_id) VALUES (?, ?, ?)`,
      [title, content, adminId],
      (err, result) => callback(err, result)
    );
  }
};
