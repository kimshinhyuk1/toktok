const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const db = admin.firestore(); // Firebase Firestore 초기화

// 모든 사용자 조회
exports.getAllUsers = async (req, res) => {
  try {
    const users = []; // 더미 데이터로 대체 (필요 시 수정)
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 특정 사용자 조회
exports.getUserById = async (req, res) => {
  try {
    const user = null; // 더미 데이터로 대체 (필요 시 수정)
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 사용자 생성
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword }; // 더미 데이터로 대체 (필요 시 수정)
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 사용자 업데이트
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = { ...req.body }; // 더미 데이터로 대체 (필요 시 수정)
    if (!updatedUser) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 사용자 삭제
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = true; // 더미 데이터로 대체 (필요 시 수정)
    if (!deletedUser) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '사용자가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 사용자 프로필 조회
exports.getUserProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve user profile',
      error: error.message,
    });
  }
};

// 사용자 프로필 수정
exports.updateUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const { name, profilePicture } = req.body;

  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      name: name,
      profilePicture: profilePicture,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update user profile',
      error: error.message,
    });
  }
};
