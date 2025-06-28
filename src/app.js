require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const houseRoutes = require("./routes/house.routes");
const adminRoutes = require("./routes/admin.routes");
const managerRoutes = require("./routes/manager.routes");
const authRouter = require("./routes/auth.routes");
const houseNeedRouter = require("./routes/houseNeed.routes");

// DB 연결 실행
require("./config/db");

app.use(cors());
app.use(express.json());

app.use("/api/houses", houseRoutes);
app.use("/api/auth", authRouter);
app.use("/api/care-workers", houseNeedRouter);

app.use("/api/admin", adminRoutes);      // 관리자 회원가입/로그인
app.use("/api/manager", managerRoutes);  // 관리자 권한 기능(매칭 등)

app.get("/", (req, res) => {
  res.status(200).send("API 서버가 정상 작동 중입니다.");
});

// 에러 핸들러 (가장 마지막에)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
