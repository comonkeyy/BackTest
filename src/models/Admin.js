const db = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  register: (user_id, password, email, name, phone, callback) => {
    db.query(
      "SELECT * FROM admins WHERE user_id = ?",
      [user_id],
      async (err, results) => {
        if (err) return callback(err);
        if (results.length > 0)
          return callback(null, { error: "이미 사용중인 관리자 아이디입니다." });

        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
          "INSERT INTO admins (user_id, password, email, name, phone) VALUES (?, ?, ?, ?, ?)",
          [user_id, hashedPassword, email, name, phone],
          function (err, result) {
            if (err) return callback(err);
            db.query(
              "SELECT * FROM admins WHERE id = ?",
              [result.insertId],
              (err, rows) => {
                if (err) return callback(err);
                const admin = rows[0];
                callback(null, { success: true, admin });
              }
            );
          }
        );
      }
    );
  },

  login: (user_id, password, callback) => {
    db.query(
      "SELECT * FROM admins WHERE user_id = ?",
      [user_id],
      async (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);

        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return callback(null, null);

        callback(null, {
          admin: {
            id: admin.id,
            user_id: admin.user_id,
            email: admin.email,
            name: admin.name,
            phone: admin.phone
          }
        });
      }
    );
  }
};
