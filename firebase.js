// firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: 'AIzaSyBMrQfuIv7_zKiyAzujGa8Mu0OItFqJcys',
  authDomain: 'toktok-49329.firebaseapp.com',
  projectId: 'toktok-49329',
  storageBucket: 'toktok-49329.appspot.com',
  messagingSenderId: '558561658454',
  appId: '1:558561658454:web:44413a23bd72918a259df7',
};

let db;
try {
  // Firebase 초기화
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

module.exports = db;
