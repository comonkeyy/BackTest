const careworkerMatchingModel = require("../models/careworkerMatching");

// 복지사 매칭 신청
exports.requestMatch = (req, res, next) => {
  const careworkerId = req.user.id; // 로그인 복지사
  const { houseId } = req.body;
  if (!houseId) {
    return res.status(400).json({ success: false, message: "houseId는 필수입니다." });
  }
  careworkerMatchingModel.requestMatch(careworkerId, houseId, (err, result) => {
    if (err) return next(err);
    if (result.alreadyRequested) {
      return res.status(409).json({ success: false, message: "이미 신청한 빈집입니다." });
    }
    res.json({ success: true, matchingId: result.insertId });
  });
};

// 복지사 매칭 현황 조회
exports.getMyMatchings = (req, res, next) => {
  const careworkerId = req.user.id;
  careworkerMatchingModel.getMyMatchings(careworkerId, (err, results) => {
    if (err) return next(err);
    res.json({ success: true, matchings: results });
  });
};
