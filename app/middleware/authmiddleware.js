// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// JWT 인증 미들웨어
const authMiddleware = (req, res, next) => {
  try {
    // Authorization 헤더가 있는지 확인
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    // Bearer 토큰에서 실제 토큰 값 추출
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    }

    // 토큰 검증
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'defaultSecretKey'
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = authMiddleware;
