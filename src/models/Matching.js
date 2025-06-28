// models/matching.js
const db = require("../config/db");

// 매칭 등록
exports.create = (house_id, careworker_id, status, callback) => {
  db.query(
    "INSERT INTO matchings (house_id, careworker_id, status, created_at) VALUES (?, ?, ?, NOW())",
    [house_id, careworker_id, status],
    (err, result) => callback(err, result)
  );
};

// 매칭 전체 목록 조회
exports.getAll = (callback) => {
  db.query("SELECT * FROM matchings ORDER BY created_at DESC", (err, results) =>
    callback(err, results)
  );
};

// 매칭 상세 조회
exports.get = (id, callback) => {
  db.query("SELECT * FROM matchings WHERE id = ?", [id], (err, results) =>
    callback(err, results)
  );
};

// 매칭 수정
exports.update = (id, house_id, careworker_id, status, callback) => {
  db.query(
    "UPDATE matchings SET house_id = ?, careworker_id = ?, status = ? WHERE id = ?",
    [house_id, careworker_id, status, id],
    (err, result) => callback(err, result)
  );
};

// 매칭 삭제
exports.delete = (id, callback) => {
  db.query("DELETE FROM matchings WHERE id = ?", [id], (err, result) =>
    callback(err, result)
  );
};
