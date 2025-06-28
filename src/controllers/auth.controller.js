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

// 카카오 로그인
exports.kakaoLogin = (req, res, next) => {
  const { kakaoId, email, name } = req.body;
  if (!kakaoId || !email) {
    const err = new Error("카카오ID, email은 필수입니다.");
    err.status = 400;
    return next(err);
  }
  userModel.kakaoLogin(kakaoId, email, name, (err, result) => {
    if (err) return next(err);
    res.json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  });
};

// 로그아웃
exports.logout = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    const err = new Error("refreshToken이 필요합니다.");
    err.status = 400;
    return next(err);
  }
  userModel.logout(refreshToken, (err, result) => {
    if (err) return next(err);
    res.json({ success: true });
  });
};

// 토큰 재발급
exports.reissue = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    const err = new Error("refreshToken이 필요합니다.");
    err.status = 400;
    return next(err);
  }
  userModel.reissue(refreshToken, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, accessToken: result.accessToken });
  });
};

// 비밀번호 변경
exports.changePassword = (req, res, next) => {
  const { user_id, oldPassword, newPassword } = req.body;
  if (!user_id || !oldPassword || !newPassword) {
    const err = new Error("user_id, oldPassword, newPassword 모두 필요합니다.");
    err.status = 400;
    return next(err);
  }
  userModel.changePassword(user_id, oldPassword, newPassword, (err, result) => {
    if (err) return next(err);
    res.json({ success: true });
  });
};


