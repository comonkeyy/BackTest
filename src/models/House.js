const db = require("../config/db");

const House = {
  // 내가 등록한 빈집 목록 조회
  findByOwner: (ownerId, callback) => {
    db.query(
      "SELECT id, address, region, size, floor, status, created_at FROM houses WHERE owner_id = ?",
      [ownerId],
      callback
    );
  },

  // 빈집 등록
  create: (ownerId, address, region, size, floor, callback) => {
    db.query(
      "INSERT INTO houses (owner_id, address, region, size, floor) VALUES (?, ?, ?, ?, ?)",
      [ownerId, address, region, size, floor],
      callback
    );
  },

  // 빈집 수정
  update: (houseId, ownerId, data, callback) => {
    db.query(
      "UPDATE houses SET address=?, region=?, size=?, floor=?, status=? WHERE id=? AND owner_id=?",
      [data.address, data.region, data.size, data.floor, data.status, houseId, ownerId],
      callback
    );
  },

  // 빈집 삭제
  delete: (houseId, ownerId, callback) => {
    db.query(
      "DELETE FROM houses WHERE id=? AND owner_id=?",
      [houseId, ownerId],
      callback
    );
  }
};

module.exports = House;
