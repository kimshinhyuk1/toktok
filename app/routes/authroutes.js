// auth.js 파일

const jwt = require('jsonwebtoken'); // 이미 선언된 경우 추가 선언을 하지 마세요.
// 중복 선언이 발생하지 않도록 다른 부분에서는 이 require문을 제거하세요.

// 인증 미들웨어 정의
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 인증된 사용자 정보를 요청 객체에 저장
    next(); // 다음 미들웨어로 진행
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = auth;
