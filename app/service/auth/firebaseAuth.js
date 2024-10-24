import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from './firebase';

const db = getFirestore();

// 사용자 등록 후 Firestore에 사용자 데이터 저장
async function saveUserData(user) {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    name: user.displayName || 'Anonymous',
    email: user.email,
    phoneNumber: user.phoneNumber,
    createdAt: new Date(),
  });
}

// 사용자가 가입에 성공한 후 호출
async function onUserRegistered(userCredential) {
  const user = userCredential.user;
  await saveUserData(user);
}
import { addDoc, collection } from 'firebase/firestore';

async function submitFeedback(userId, productId, content) {
  try {
    await addDoc(collection(db, 'feedbacks'), {
      userId,
      productId,
      content,
      timestamp: new Date(),
    });
    console.log('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
}
