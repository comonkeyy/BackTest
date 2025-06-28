// routes/review.routes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

router.post("/", reviewController.createReview); // 후기 작성
router.get("/", reviewController.getAllReviews); // 후기 전체 조회
router.get("/:reviewId", reviewController.getReview); // 후기 상세 조회
router.patch("/:reviewId", reviewController.updateReview); // 후기 수정
router.delete("/:reviewId", reviewController.deleteReview); // 후기 삭제

module.exports = router;
