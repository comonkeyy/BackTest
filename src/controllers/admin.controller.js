const adminModel = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const { user_id, password, email, name, phone } = req.body;
  if (!user_id || !password || !email || !name || !phone)
    return res.status(400).json({ success: false, message: "필수 항목 누락" });

  adminModel.register(user_id, password, email, name, phone, (err, result) => {
    if (err) return next(err);
    if (result && result.error)
      return res.status(400).json({ success: false, message: result.error });

    const adminInfo = result.admin;
    const accessToken = jwt.sign(
      { id: adminInfo.id, user_id: adminInfo.user_id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: adminInfo.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      admin: {
        user_id: adminInfo.user_id,
        email: adminInfo.email,
        name: adminInfo.name,
        phone: adminInfo.phone
      },
      accessToken,
      refreshToken
    });
  });
};

exports.login = (req, res, next) => {
  const { user_id, password } = req.body;
  if (!user_id || !password)
    return res.status(400).json({ success: false, message: "필수 항목 누락" });

  adminModel.login(user_id, password, (err, result) => {
    if (err) return next(err);
    if (!result)
      return res.status(401).json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });

    const adminInfo = result.admin;
    const accessToken = jwt.sign(
      { id: adminInfo.id, user_id: adminInfo.user_id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: adminInfo.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      admin: {
        user_id: adminInfo.user_id,
        email: adminInfo.email,
        name: adminInfo.name,
        phone: adminInfo.phone
      },
      accessToken,
      refreshToken
    });
  });
};
