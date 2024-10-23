const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const auth = require('./auth');

// 더미 데이터 사용자 목록
const users = [
  {
    _id: 'dummyUserId',
    email: 'test@example.com',
    password: await bcrypt.hash('dummyPassword', 10), // 암호화된 비밀번호
  },
];

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: '유효하지 않은 이메일입니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultSecretKey',
      {
        expiresIn: '1h',
      }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용자 프로필 조회 (인증 필요)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = users.find((u) => u._id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
