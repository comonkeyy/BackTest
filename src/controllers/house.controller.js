const db = require("../config/db");
const House = require("../models/House");

// 집주인 홈: 내 정보 + 내가 등록한 빈집 목록 + 각 빈집별 매칭 현황
exports.getOwnerHome = (req, res, next) => {
  const ownerId = req.user.id;

  // 1. 집주인(본인) 정보 조회
  db.query(
    "SELECT id, name, phone, email FROM users WHERE id = ?",
    [ownerId],
    (err, userRows) => {
      if (err) return next(err);
      if (userRows.length === 0)
        return res.status(404).json({ success: false, message: "사용자 정보 없음" });

      // 2. 내가 등록한 빈집 목록 조회
      House.findByOwner(ownerId, (err2, houseRows) => {
        if (err2) return next(err2);

        if (!houseRows || houseRows.length === 0) {
          // 빈집이 없다면 매칭 현황은 빈 배열로
          return res.json({
            success: true,
            user: userRows[0],
            houses: []
          });
        }

        // 3. 각 빈집별 매칭 현황 조회
        const houseIds = houseRows.map(h => h.id);
        db.query(
          `SELECT m.*, u.name AS careworker_name, u.phone AS careworker_phone
           FROM matchings m
           JOIN users u ON m.careworker_id = u.id
           WHERE m.house_id IN (?)`,
          [houseIds],
          (err3, matchingRows) => {
            if (err3) return next(err3);

            // 각 집별로 매칭 내역을 매핑
            const housesWithMatchings = houseRows.map(house => ({
              ...house,
              matchings: matchingRows.filter(m => m.house_id === house.id)
            }));

            res.json({
              success: true,
              user: userRows[0],
              houses: housesWithMatchings
            });
          }
        );
      });
    }
  );
};

// 내가 등록한 빈집 목록 조회
exports.getMyHouses = (req, res, next) => {
  const ownerId = req.user.id;
  House.findByOwner(ownerId, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

// 빈집 등록
exports.createHouse = (req, res, next) => {
  const ownerId = req.user.id;
  const { address, region, size, floor } = req.body;
  House.create(ownerId, address, region, size, floor, (err, result) => {
    if (err) return next(err);
    res.json({ message: "빈집 등록 성공", houseId: result.insertId });
  });
};

// 빈집 정보 수정
exports.updateHouse = (req, res, next) => {
  const ownerId = req.user.id;
  const houseId = req.params.id;
  const { address, region, size, floor, status } = req.body;
  House.update(houseId, ownerId, { address, region, size, floor, status }, (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    res.json({ message: "빈집 정보 수정 완료", houseId: Number(houseId) });
  });
};

// 빈집 정보 삭제
exports.deleteHouse = (req, res, next) => {
  const ownerId = req.user.id;
  const houseId = req.params.id;
  House.delete(houseId, ownerId, (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    res.json({ message: "빈집 삭제 완료", houseId: Number(houseId) });
  });
};
