// 필요한 모듈 불러오기
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const admin = require('firebase-admin');

// 환경 변수 로드 (가장 먼저 로드해야 함)
dotenv.config();

// Firebase Admin SDK 초기화
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore 참조
const db = admin.firestore();

// Express 애플리케이션 설정
const app = express();
app.use(express.json());

// 사용자 라우트는 Firebase 초기화 이후에 불러오기
const userRoutes = require('./app/routes/userRoutes');
app.use('/api/users', userRoutes);

// 정적 파일 제공 설정 (필요 시 추가 가능)

// Firebase 연결 확인용 라우트 추가
app.get('/test-firebase', async (req, res) => {
  try {
    // Firestore에 테스트 데이터 추가
    const docRef = db.collection('test').doc('firebaseCheck');
    await docRef.set({
      testField: 'Firebase connection successful!',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Firestore에서 테스트 데이터 읽기
    const doc = await docRef.get();
    if (doc.exists) {
      res.json({
        message: doc.data().testField,
        timestamp: doc.data().timestamp,
      });
    } else {
      res.status(404).json({ message: 'No document found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Firebase connection failed', error: error.message });
  }
});

// 서버 시작
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중`);
});
