const db = require("../config/db");

// 복지사 매칭 신청
exports.requestMatch = (careworkerId, houseId, callback) => {
  // 이미 신청한 적 있는지 체크 (중복 방지)
  db.query(
    "SELECT id FROM matchings WHERE careworker_id = ? AND house_id = ?",
    [careworkerId, houseId],
    (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) {
        return callback(null, { alreadyRequested: true });
      }
      db.query(
        "INSERT INTO matchings (house_id, careworker_id, status, created_at) VALUES (?, ?, 'pending', NOW())",
        [houseId, careworkerId],
        (err2, result) => callback(err2, { insertId: result?.insertId })
      );
    }
  );
};

// 복지사 매칭 현황 조회 (내 신청/진행 내역)
exports.getMyMatchings = (careworkerId, callback) => {
  db.query(
    `SELECT 
        m.id AS matching_id,
        m.status,
        m.created_at,
        h.id AS house_id,
        h.address,
        h.region,
        h.size,
        h.floor
     FROM matchings m
     JOIN houses h ON m.house_id = h.id
     WHERE m.careworker_id = ?
     ORDER BY m.created_at DESC`,
    [careworkerId],
    (err, results) => callback(err, results)
  );
};
