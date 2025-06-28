// models/cart.js
const db = require("../config/db");

exports.create = (careworker_id, house_id, callback) => {
  db.query(
    "INSERT INTO cart (careworker_id, house_id, created_at) VALUES (?, ?, NOW())",
    [careworker_id, house_id],
    (err, result) => callback(err, result)
  );
};

exports.getAll = (callback) => {
  db.query("SELECT * FROM cart ORDER BY created_at DESC", (err, results) =>
    callback(err, results)
  );
};

exports.get = (id, callback) => {
  db.query("SELECT * FROM cart WHERE id = ?", [id], (err, results) =>
    callback(err, results)
  );
};

exports.delete = (id, callback) => {
  db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) =>
    callback(err, result)
  );
};
