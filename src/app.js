require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const houseRoutes = require("./routes/house.routes");

// DB 연결 실행
require("./config/db");

const authRouter = require("./routes/auth.routes");

app.use(cors()); // 모든 도메인 허용 (개발용)
app.use(express.json()); // <-- 반드시 라우터 등록 전에!

app.use("/houses", houseRoutes);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).send("TodoList API 서버가 정상 작동 중입니다.");
});

// 모든 라우터 뒤에 추가 (가장 마지막 미들웨어)
app.use((err, req, res, next) => {
  console.error(err.stack); // 서버 로그 출력

  // 클라이언트에 에러 응답
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
