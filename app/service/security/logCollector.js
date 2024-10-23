// services/security/logCollector.js
const fs = require('fs');

const logEvent = (event) => {
  const logMessage = `${new Date().toISOString()} - ${event}\n`;
  fs.appendFile('security_logs.log', logMessage, (err) => {
    if (err) {
      console.error('로그 저장 실패:', err);
    }
  });
};

module.exports = logEvent;
