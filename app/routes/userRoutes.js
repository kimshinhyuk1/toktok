// userRoutes.js 파일

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController'); // 상대 경로로 수정

// 모든 사용자 조회
router.get('/', userController.getAllUsers);

// 특정 사용자 조회
router.get('/:id', userController.getUserById);

// 사용자 생성
router.post('/', userController.createUser);

// 사용자 업데이트
router.put('/:id', userController.updateUser);

// 사용자 삭제
router.delete('/:id', userController.deleteUser);

module.exports = router;
