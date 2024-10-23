const axios = require('axios');

const getChatbotResponse = async (userMessage) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: userMessage,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return '챗봇이 응답할 수 없습니다. 잠시 후 다시 시도해주세요.';
  }
};

module.exports = getChatbotResponse;
