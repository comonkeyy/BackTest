// models/houseNeed.js
const db = require("../config/db");

exports.create = (careworker_id, region, size, floor, callback) => {
  db.query(
    "INSERT INTO house_need (careworker_id, region, size, floor, created_at) VALUES (?, ?, ?, ?, NOW())",
    [careworker_id, region, size, floor],
    (err, result) => callback(err, result)
  );
};

exports.update = (id, region, size, floor, callback) => {
  db.query(
    "UPDATE house_need SET region = ?, size = ?, floor = ? WHERE id = ?",
    [region, size, floor, id],
    (err, result) => callback(err, result)
  );
};

exports.delete = (id, callback) => {
  db.query("DELETE FROM house_need WHERE id = ?", [id], (err, result) =>
    callback(err, result)
  );
};

exports.get = (id, callback) => {
  db.query("SELECT * FROM house_need WHERE id = ?", [id], (err, results) =>
    callback(err, results)
  );
};
