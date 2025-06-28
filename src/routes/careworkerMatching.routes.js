const express = require("express");
const router = express.Router();
const careworkerMatchingController = require("../controllers/careworkerMatching.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 복지사 매칭 신청
router.post("/requestMatch", authMiddleware, careworkerMatchingController.requestMatch);

// 복지사 매칭 현황 조회
router.get("/myMatchings", authMiddleware, careworkerMatchingController.getMyMatchings);

module.exports = router;
