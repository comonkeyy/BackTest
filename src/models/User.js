// 로그인
// User.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const refreshTokens = new Set();

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
          { expiresIn: "24h" }
        );
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        refreshTokens.add(refreshToken); // ← 이 줄 추가!

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
  kakaoLogin: (kakaoId, email, name, callback) => {
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [kakaoId],
      async (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) {
          // 최초 카카오 로그인 시 회원 자동 등록 (이메일, 이름만 저장, 패스워드는 null)
          db.query(
            "INSERT INTO users (user_id, email, name, role) VALUES (?, ?, ?, ?)",
            [kakaoId, email, name, "OWNER"], // role은 임시로 OWNER
            (err, insertResult) => {
              if (err) return callback(err);
              // 다시 조회해서 토큰 발급
              db.query(
                "SELECT * FROM users WHERE user_id = ?",
                [kakaoId],
                async (err, results) => {
                  if (err) return callback(err);
                  const user = results[0];
                  const accessToken = jwt.sign(
                    { id: user.id, user_id: user.user_id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                  );
                  const refreshToken = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: "7d",
                    }
                  );
                  refreshTokens.add(refreshToken);
                  callback(null, { user, accessToken, refreshToken });
                }
              );
            }
          );
        } else {
          // 이미 가입된 카카오 계정
          const user = results[0];
          const accessToken = jwt.sign(
            { id: user.id, user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );
          refreshTokens.add(refreshToken);
          callback(null, { user, accessToken, refreshToken });
        }
      }
    );
  },

  // 로그아웃 (refreshToken 무효화)
  logout: (refreshToken, callback) => {
    refreshTokens.delete(refreshToken);
    callback(null, { success: true });
  },

  // 토큰 재발급
  reissue: (refreshToken, callback) => {
    if (!refreshTokens.has(refreshToken)) {
      return callback(new Error("유효하지 않은 refreshToken입니다."));
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      // 재발급: accessToken만 새로 발급
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (err, results) => {
          if (err) return callback(err);
          if (results.length === 0)
            return callback(new Error("사용자를 찾을 수 없습니다."));
          const user = results[0];
          const accessToken = jwt.sign(
            { id: user.id, user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          callback(null, { accessToken });
        }
      );
    } catch (err) {
      callback(err);
    }
  },

  // 비밀번호 변경
  changePassword: (user_id, oldPassword, newPassword, callback) => {
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id],
      async (err, results) => {
        if (err) return callback(err);
        if (results.length === 0)
          return callback(new Error("사용자를 찾을 수 없습니다."));
        const user = results[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
          return callback(new Error("기존 비밀번호가 일치하지 않습니다."));

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        db.query(
          "UPDATE users SET password = ? WHERE user_id = ?",
          [hashedPassword, user_id],
          (err) => {
            if (err) return callback(err);
            callback(null, { success: true });
          }
        );
      }
    );
  },

    // 전체 계정 목록 조회
    getAll: (callback) => {
        db.query(
          "SELECT id, user_id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC",
          [],
          (err, results) => callback(err, results)
        );
      },
    
      // 특정 계정 상세 조회
      getById: (userId, callback) => {
        db.query(
          "SELECT id, user_id, name, email, phone, role, created_at FROM users WHERE id = ?",
          [userId],
          (err, results) => callback(err, results[0])
        );
      },
    
      // 계정 신규 등록 (관리자에서 직접 생성)
      create: ({ user_id, password, name, email, phone, role }, callback) => {
        // 비밀번호는 반드시 암호화해서 저장!
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
          if (err) return callback(err);
          db.query(
            "INSERT INTO users (user_id, password, name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, hashedPassword, name, email, phone, role],
            (err, result) => callback(err, result)
          );
        });
      },
    
      // 계정 정보 수정 (관리자용)
      update: (userId, updateData, callback) => {
        // 동적으로 쿼리 생성
        const fields = [];
        const values = [];
        for (let key in updateData) {
          // 비밀번호 수정 시 암호화 필요
          if (key === "password") continue; // 비밀번호는 별도 처리
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
        values.push(userId);
        db.query(
          `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
          values,
          (err, result) => callback(err, result)
        );
      },
    
      // 계정 삭제
      delete: (userId, callback) => {
        db.query(
          "DELETE FROM users WHERE id = ?",
          [userId],
          (err, result) => callback(err, result)
        );
      },
    

  // refreshTokens 관리용 (테스트/개발용)
  _refreshTokens: refreshTokens,
};
