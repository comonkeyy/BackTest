const express = require("express");
const router = express.Router();
const houseController = require("../controllers/house.controller");
const auth = require("../middlewares/auth.middleware");

// 내가 등록한 빈집 목록 조회
router.get("/my", auth, houseController.getMyHouses);

// 빈집 등록
router.post("/", auth, houseController.createHouse);

// 빈집 정보 수정
router.put("/:id", auth, houseController.updateHouse);

// 빈집 정보 삭제
router.delete("/:id", auth, houseController.deleteHouse);

module.exports = router;
