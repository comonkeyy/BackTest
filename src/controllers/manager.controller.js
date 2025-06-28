const matchingModel = require("../models/matching");
const noticeModel = require("../models/Notice");
const userModel = require("../models/User");

exports.getAllMatchings = (req, res, next) => {
  matchingModel.getAll((err, matchings) => {
    if (err) return next(err);
    res.json({ success: true, matchings });
  });
};

exports.createNotice = (req, res, next) => {
  const { title, content } = req.body;
  const adminId = req.user.id; // JWT에서 추출

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, message: "제목과 내용을 입력하세요." });
  }

  noticeModel.create(title, content, adminId, (err, result) => {
    if (err) return next(err);
    res.status(201).json({ success: true, noticeId: result.insertId });
  });
};

// 전체 계정 목록 조회
exports.getAllUsers = (req, res, next) => {
  userModel.getAll((err, users) => {
    if (err) return next(err);
    res.json({ success: true, users });
  });
};

// 특정 계정 상세 정보 조회
exports.getUserDetail = (req, res, next) => {
  const userId = req.params.userId;
  userModel.getById(userId, (err, user) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "계정을 찾을 수 없습니다." });
    res.json({ success: true, user });
  });
};

// 계정 신규 등록
exports.createUser = (req, res, next) => {
  const { user_id, password, name, email, phone, role } = req.body;
  if (!user_id || !password || !name || !role) {
    return res.status(400).json({ success: false, message: "필수 항목 누락" });
  }
  userModel.create(
    { user_id, password, name, email, phone, role },
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({ success: true, userId: result.insertId });
    }
  );
};

// 계정 정보 수정
exports.updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const updateData = req.body;
  userModel.update(userId, updateData, (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "계정을 찾을 수 없습니다." });
    res.json({ success: true, message: "계정이 수정되었습니다." });
  });
};

// 계정 삭제
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  userModel.delete(userId, (err, result) => {
    if (err) return next(err);
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "계정을 찾을 수 없습니다." });
    res.json({ success: true, message: "계정이 삭제되었습니다." });
  });
};
