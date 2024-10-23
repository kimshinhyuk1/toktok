// controllers/userController.js
// const User = require('../models/User'); // 모델 가져오기 제거
const bcrypt = require('bcrypt');

// 모든 사용자 조회
exports.getAllUsers = async (req, res) => {
  try {
    // const users = await User.find(); // 데이터베이스 호출 제거
    const users = []; // 더미 데이터로 대체 (필요 시 수정)
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 특정 사용자 조회
exports.getUserById = async (req, res) => {
  try {
    // const user = await User.findById(req.params.id); // 데이터베이스 호출 제거
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
    // const newUser = new User({ // 데이터베이스 호출 제거
    //   name,
    //   email,
    //   password: hashedPassword,
    // });
    // await newUser.save(); // 데이터베이스 저장 호출 제거
    const newUser = { name, email, password: hashedPassword }; // 더미 데이터로 대체 (필요 시 수정)
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 사용자 업데이트
exports.updateUser = async (req, res) => {
  try {
    // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { // 데이터베이스 호출 제거
    //   new: true,
    // });
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
    // const deletedUser = await User.findByIdAndDelete(req.params.id); // 데이터베이스 호출 제거
    const deletedUser = true; // 더미 데이터로 대체 (필요 시 수정)
    if (!deletedUser) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '사용자가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
};
