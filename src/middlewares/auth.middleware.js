// 인증 및 오류 처리 등
// auth.middleware.js
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error("토큰이 없습니다.");
    err.status = 401;
    return next(err);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(err);
  }
};
