const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require('socket.io'); // 최신 버전의 Socket.IO 사용
const helmet = require('helmet');
const cors = require('cors');

// 환경 변수 설정
dotenv.config();

// 라우트와 소켓 가져오기
const userRoutes = require(path.join(__dirname, 'app', 'routes', 'userRoutes'));
const authRoutes = require(path.join(__dirname, 'app', 'routes', 'auth'));
const chatSocket = require(path.join(
  __dirname,
  'app',
  'sockets',
  'chatSocket'
));
const db = require('./firebase'); // Firebase 초기화 파일

// Express 설정
const app = express();
const server = http.createServer(app);

// Socket.IO 서버 설정
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000', // 필요에 따라 허용할 도메인을 설정합니다.
    methods: ['GET', 'POST'],
  },
});

// 미들웨어 설정
app.use(express.json());
app.use(helmet());
app.use(cors());

// Firestore 데이터 가져오기 예시
app.get('/fire-data', async (req, res) => {
  try {
    const snapshot = await db.collection('YOUR_COLLECTION_NAME').get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// 사용자 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Socket.IO 클라이언트 라이브러리 제공 경로 추가
app.use(
  '/static',
  express.static(
    path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')
  )
);

// Socket.IO 연결 처리
chatSocket(io); // 'chatSocket.js' 모듈을 호출하여 io 객체 전달

// 서버 시작
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
