const express = require("express");
const router = express.Router();
const managerController = require("../controllers/manager.controller");
const auth = require("../middlewares/auth.middleware");
const adminAuth = require("../middlewares/adminAuth.middleware");

// 매칭 관리
router.get("/matchings", auth, adminAuth, managerController.getAllMatchings);

// 공지사항 관리
router.post("/notices", auth, adminAuth, managerController.createNotice);

// 계정 관리
router.get("/users", auth, adminAuth, managerController.getAllUsers);          // 전체 계정 목록 조회
router.get("/users/:userId", auth, adminAuth, managerController.getUserDetail); // 특정 계정 상세 조회
router.post("/users", auth, adminAuth, managerController.createUser);           // 계정 신규 등록
router.patch("/users/:userId", auth, adminAuth, managerController.updateUser);  // 계정 정보 수정
router.delete("/users/:userId", auth, adminAuth, managerController.deleteUser); // 계정 삭제
// routes/manager.routes.js
router.get("/houses", adminAuth, managerController.getAllHouses);


module.exports = router;
