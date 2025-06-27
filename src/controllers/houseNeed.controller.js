// controllers/houseNeed.controller.js
const houseNeedModel = require("../models/houseNeed");

exports.createHouseNeed = (req, res, next) => {
  const { careworker_id, region, size, floor } = req.body;
  if (!careworker_id || !region || !size || !floor) {
    return res.status(400).json({ success: false, message: "필수값 누락" });
  }
  houseNeedModel.create(careworker_id, region, size, floor, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, id: result.insertId });
  });
};

exports.updateHouseNeed = (req, res, next) => {
  const { id } = req.params;
  const { region, size, floor } = req.body;
  houseNeedModel.update(id, region, size, floor, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, affectedRows: result.affectedRows });
  });
};

exports.deleteHouseNeed = (req, res, next) => {
  const { id } = req.params;
  houseNeedModel.delete(id, (err, result) => {
    if (err) return next(err);
    res.json({ success: true, affectedRows: result.affectedRows });
  });
};

exports.getHouseNeed = (req, res, next) => {
  const { id } = req.params;
  houseNeedModel.get(id, (err, results) => {
    if (err) return next(err);
    if (results.length === 0)
      return res.status(404).json({ success: false, message: "조건 없음" });
    res.json({ success: true, data: results[0] });
  });
};
