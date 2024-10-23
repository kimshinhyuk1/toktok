const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes'); // 사용자 라우트 불러오기

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB 관련 코드 제거

// 사용자 라우트 사용
app.use('/api/users', userRoutes);

app.use(
  '/static',
  express.static(
    path.join(__dirname, 'node_modules', 'socket.io', 'client-dist'),
    {
      setHeaders: (res, path, stat) => {
        // JavaScript 파일의 MIME 타입 명시적으로 설정
        if (path.endsWith('.js')) {
          res.set('Content-Type', 'application/javascript');
        }
      },
    }
  )
);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중`);
});
