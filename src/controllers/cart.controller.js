// controllers/cart.controller.js
const cartModel = require("../models/cart");

// 카트 등록
exports.createCart = (req, res, next) => {
  const { careworker_id, house_id } = req.body;
  if (!careworker_id || !house_id) {
    return res.status(400).json({ success: false, message: "필수값 누락" });
  }
  cartModel.create(careworker_id, house_id, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, id: result.insertId });
  });
};

// 카트 전체 목록
exports.getAllCart = (req, res, next) => {
  cartModel.getAll((err, results) => {
    if (err) return next(err);
    res.json({ success: true, data: results });
  });
};

// 카트 상세
exports.getCart = (req, res, next) => {
  const { id } = req.params;
  cartModel.get(id, (err, results) => {
    if (err) return next(err);
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "카트 없음" });
    res.json({ success: true, data: results[0] });
  });
};

// 카트 삭제
exports.deleteCart = (req, res, next) => {
  const { id } = req.params;
  cartModel.delete(id, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, affectedRows: result.affectedRows });
  });
};
