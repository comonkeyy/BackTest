// controllers/careworker.controller.js
const db = require("../config/db");

exports.getProfile = (req, res, next) => {
  const careworkerId = req.user.id; // 로그인 토큰에서 추출

  // 1. 사용자 기본 정보 조회
  db.query(
    "SELECT id, name, phone, email FROM users WHERE id = ?",
    [careworkerId],
    (err, userRows) => {
      if (err) return next(err);
      if (userRows.length === 0)
        return res.status(404).json({ success: false, message: "사용자 정보 없음" });

      // 2. 매칭 진행상황(예: 대기중, 완료 등) 집계
      db.query(
        "SELECT status, COUNT(*) as count FROM matchings WHERE careworker_id = ? GROUP BY status",
        [careworkerId],
        (err2, matchingRows) => {
          if (err2) return next(err2);

          res.json({
            success: true,
            data: {
              user: userRows[0],
              matchings: matchingRows // [{status: 'pending', count: 2}, ...]
            }
          });
        }
      );
    }
  );
};
