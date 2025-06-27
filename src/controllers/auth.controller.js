// 로그인
// auth.controller.js
const userModel = require("../models/User");

exports.login = (req, res, next) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) {
    const err = new Error("user_id와 password를 입력해주세요.");
    err.status = 400;
    return next(err);
  }
  userModel.login(user_id, password, (err, result) => {
    if (err) return next(err);
    if (result) {
      res.json({
        success: true,
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } else {
      const err = new Error("user_id 또는 비밀번호가 올바르지 않습니다.");
      err.status = 401;
      return next(err);
    }
  });
};
