// register.controller.js

const register = require("../models/User");
exports.register = (req, res, next) => {
  const { user_id, password, role, email, name, phone } = req.body;
  if (!user_id || !password || !role) {
    const err = new Error("user_id, password, role은 필수입니다.");
    err.status = 400;
    return next(err);
  }
  register.register(
    user_id,
    password,
    role,
    email,
    name,
    phone,
    (err, result) => {
      if (err) return next(err);
      if (result.error) {
        const err = new Error(result.error);
        err.status = 400;
        return next(err);
      }
      res.json({ success: true });
    }
  );
};
