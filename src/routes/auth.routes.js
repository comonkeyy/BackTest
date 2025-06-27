// // 라우터 정의
// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");

// router.get("/test-db", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT 1");
//     res.json({ status: "success", result: rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });

// module.exports = router;

// auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const registerController = require("../controllers/register.controller");
router.post("/login", authController.login);
router.post("/signup", registerController.register);

router.get("/login/kakao", authController.kakaoLogin); // 실제로는 POST가 더 안전
router.post("/logout", authController.logout);
router.post("/reissue", authController.reissue);
router.patch("/password", authController.changePassword);

module.exports = router;
