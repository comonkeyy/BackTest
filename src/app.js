require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const houseRoutes = require("./routes/house.routes");
const adminRoutes = require("./routes/admin.routes");
const managerRoutes = require("./routes/manager.routes");
const authRouter = require("./routes/auth.routes");
const houseNeedRouter = require("./routes/houseNeed.routes");
const careworkerMatchingRouter = require("./routes/careworkerMatching.routes");
const careworkerRouter = require("./routes/careworker.routes"); 
// DB 연결 실행
require("./config/db");





















const reviewRouter = require("./routes/review.routes");
const cartRouter = require("./routes/cart.routes");
const matchingRouter = require("./routes/matching.routes");
app.use(cors()); // 모든 도메인 허용 (개발용)
app.use(express.json()); // <-- 반드시 라우터 등록 전에!
app.use("/api/houses", houseRoutes);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoutes);      // 관리자 회원가입/로그인
app.use("/api/managers", managerRoutes);  // 관리자 권한 기능(매칭 등)
app.use("/api/care-workers", careworkerMatchingRouter);
app.use("/api/care-workers", careworkerRouter);
app.get("/", (req, res) => {
  res.status(200).send("API 서버가 정상 작동 중입니다.");
});




app.use("/api/managers/matchings", matchingRouter);
app.use("/api/care-workers/cart/", cartRouter);


app.use("/api/care-workers", houseNeedRouter);
app.use("/api/reviews", reviewRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;

