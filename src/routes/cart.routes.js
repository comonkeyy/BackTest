// routes/cart.routes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/", cartController.createCart); // 카트 등록
router.get("/", cartController.getAllCart); // 카트 전체 목록
router.get("/:id", cartController.getCart); // 카트 상세
router.delete("/:id", cartController.deleteCart); // 카트 삭제

module.exports = router;
