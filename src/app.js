// src/app.js
const express = require('express');
const app = express();

// DB 연결 실행
require('./config/db');

// 기타 미들웨어, 라우터 등
app.use(express.json());

module.exports = app;
