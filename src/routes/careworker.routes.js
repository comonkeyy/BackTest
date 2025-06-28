// routes/careworker.routes.js
const express = require("express");
const router = express.Router();
const careworkerController = require("../controllers/careworker.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/profile", authMiddleware, careworkerController.getProfile);

module.exports = router;
