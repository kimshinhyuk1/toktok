// tests/userController.test.js

// 컨트롤러 파일에서 함수 가져오기
// 올바른 경로로 수정
const userController = require('../app/controller/userController');

// Jest의 describe 블록을 사용하여 그룹화
describe('User Controller - Unit Tests', () => {
  // getAllUsers 테스트
  test('getAllUsers should return empty array', async () => {
    // 가짜 req, res 객체 생성
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.getAllUsers(req, res);

    // 예상 결과 확인
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  // createUser 테스트
  test('createUser should return a new user with hashed password', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.createUser(req, res);

    // 예상 결과 확인
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        password: expect.any(String), // 해시된 비밀번호가 포함되어 있어야 함
      })
    );
  });
});
