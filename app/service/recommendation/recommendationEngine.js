// services/recommendation/recommendationEngine.js
const axios = require('axios');

// 추천 상품을 가져오는 함수
const recommendProduct = async (userContext) => {
  try {
    const response = await axios.get('https://api.example.com/products', {
      params: { keyword: userContext.keyword },
    });
    return response.data;
  } catch (error) {
    console.error('상품 추천 오류:', error);
    return [];
  }
};

module.exports = recommendProduct;
