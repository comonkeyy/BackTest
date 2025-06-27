// models/reviews.js
const db = require("../config/db");

exports.create = (author_id, content, callback) => {
  db.query(
    "INSERT INTO reviews (author_id, content, created_at) VALUES (?, ?, NOW())",
    [author_id, content],
    (err, result) => callback(err, result)
  );
};

exports.getAll = (callback) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, results) =>
    callback(err, results)
  );
};

exports.get = (reviewId, callback) => {
  db.query("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, results) =>
    callback(err, results)
  );
};

exports.update = (reviewId, content, callback) => {
  db.query(
    "UPDATE reviews SET content = ? WHERE id = ?",
    [content, reviewId],
    (err, result) => callback(err, result)
  );
};

exports.delete = (reviewId, callback) => {
  db.query("DELETE FROM reviews WHERE id = ?", [reviewId], (err, result) =>
    callback(err, result)
  );
};
