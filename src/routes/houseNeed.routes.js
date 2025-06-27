// routes/houseNeed.routes.js
const express = require("express");
const router = express.Router();
const houseNeedController = require("../controllers/houseNeed.controller");

router.post("/house-preferences", houseNeedController.createHouseNeed);
router.patch("/house-preferences/:id", houseNeedController.updateHouseNeed);
router.delete("/house-preferences/:id", houseNeedController.deleteHouseNeed);
router.get("/house-preferences/:id", houseNeedController.getHouseNeed);

module.exports = router;
