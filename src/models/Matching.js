const db = require("../config/db");

module.exports = {
  getAll: (callback) => {
    db.query(
      `SELECT m.id, m.status, m.created_at, h.address AS house_address, u.name AS careworker_name
       FROM matchings m
       JOIN houses h ON m.house_id = h.id
       JOIN users u ON m.careworker_id = u.id
       ORDER BY m.created_at DESC`,
      [],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }
};
