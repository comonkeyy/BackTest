module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "관리자만 접근 가능합니다." });
    }
    next();
  };
  