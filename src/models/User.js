// 로그인
// User.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  // 로그인
  login: (user_id, password, callback) => {
    // 1. DB에서 loginid로 사용자 조회
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id],
      async (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) {
          // 사용자 없음
          return callback(null, null);
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return callback(null, null);

        const accessToken = jwt.sign(
          { id: user.id, user_id: user.user_id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        callback(null, {
          user: {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          },
          accessToken,
          refreshToken,
        });
      }
    );
  },
  register: (user_id, password, role, email, name, phone, callback) => {
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id],
      async (err, results) => {
        if (err) return callback(err);
        if (results.length > 0)
          return callback(null, { error: "이미 사용중인 아이디입니다." });

        const saltRounds = 10;
        try {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          db.query(
            "INSERT INTO users (user_id, password, role, email, name, phone) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, hashedPassword, role, email, name, phone],
            (err) => {
              if (err) return callback(err);
              callback(null, { success: true });
            }
          );
        } catch (hashErr) {
          callback(hashErr);
        }
      }
    );
  },
};
