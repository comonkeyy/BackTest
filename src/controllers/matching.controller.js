// controllers/matching.controller.js
const matchingModel = require("../models/Matching");

// 매칭 등록
exports.createMatching = (req, res, next) => {
  const { house_id, careworker_id, status } = req.body;
  if (!house_id || !careworker_id || !status) {
    return res.status(400).json({ success: false, message: "필수값 누락" });
  }
  matchingModel.create(house_id, careworker_id, status, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, id: result.insertId });
  });
};

// 매칭 전체 목록 조회
exports.getAllMatchings = (req, res, next) => {
  matchingModel.getAll((err, results) => {
    if (err) return next(err);
    res.json({ success: true, data: results });
  });
};

// 매칭 상세 조회
exports.getMatching = (req, res, next) => {
  const { matchingId } = req.params;
  matchingModel.get(matchingId, (err, results) => {
    if (err) return next(err);
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "매칭 없음" });
    res.json({ success: true, data: results[0] });
  });
};

// 매칭 수정
exports.updateMatching = (req, res, next) => {
  const { matchingId } = req.params;
  const { house_id, careworker_id, status } = req.body;
  matchingModel.update(
    matchingId,
    house_id,
    careworker_id,
    status,
    (err, result) => {
      if (err) return next(err);
      res.json({ success: true, affectedRows: result.affectedRows });
    }
  );
};

// 매칭 삭제
exports.deleteMatching = (req, res, next) => {
  const { matchingId } = req.params;
  matchingModel.delete(matchingId, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, affectedRows: result.affectedRows });
  });
};
