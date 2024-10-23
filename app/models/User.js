const bcrypt = require('bcrypt');

// 사용자 스키마를 제거하고, 더미 데이터나 비슷한 구조를 사용할 수 있습니다.

// 비밀번호 해시화 함수
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// 더미 사용자 객체
const User = {
  async save() {
    // 실제 데이터베이스 저장을 하지 않음
    return this;
  },
  async comparePassword(inputPassword) {
    // 비밀번호 비교 로직
    return bcrypt.compare(inputPassword, this.password);
  },
  createDummyUser(data) {
    // 더미 유저 생성 함수
    return {
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    };
  },
};

module.exports = User;
