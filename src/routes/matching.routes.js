// routes/matching.routes.js
const express = require("express");
const router = express.Router();
const matchingController = require("../controllers/matching.controller");

router.get("/", matchingController.getAllMatchings); // 전체 목록
router.get("/:matchingId", matchingController.getMatching); // 상세
router.post("/", matchingController.createMatching); // 등록
router.patch("/:matchingId", matchingController.updateMatching); // 수정
router.delete("/:matchingId", matchingController.deleteMatching); // 삭제

module.exports = router;
