// firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
