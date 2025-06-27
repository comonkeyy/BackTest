const House = require("../models/House");

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
