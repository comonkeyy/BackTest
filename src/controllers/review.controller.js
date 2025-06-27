// controllers/review.controller.js
const reviewModel = require("../models/reviews");

// 후기 작성
exports.createReview = (req, res, next) => {
  const { author_id, content } = req.body;
  if (!author_id || !content) {
    return res.status(400).json({ success: false, message: "필수값 누락" });
  }
  reviewModel.create(author_id, content, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, id: result.insertId });
  });
};

// 후기 전체 조회
exports.getAllReviews = (req, res, next) => {
  reviewModel.getAll((err, results) => {
    if (err) return next(err);
    res.json({ success: true, data: results });
  });
};

// 후기 상세 조회
exports.getReview = (req, res, next) => {
  const { reviewId } = req.params;
  reviewModel.get(reviewId, (err, results) => {
    if (err) return next(err);
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "리뷰 없음" });
    res.json({ success: true, data: results[0] });
  });
};

// 후기 수정
exports.updateReview = (req, res, next) => {
  const { reviewId } = req.params;
  const { content } = req.body;
  reviewModel.update(reviewId, content, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, affectedRows: result.affectedRows });
  });
};

// 후기 삭제
exports.deleteReview = (req, res, next) => {
  const { reviewId } = req.params;
  reviewModel.delete(reviewId, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, affectedRows: result.affectedRows });
  });
};
