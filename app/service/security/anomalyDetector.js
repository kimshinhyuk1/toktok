// services/security/anomalyDetector.js
const tf = require('@tensorflow/tfjs');
const logEvent = require('./logCollector');

// 가상 데이터셋을 이용한 이상 탐지 모델 생성
const createAnomalyDetectionModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 10, inputShape: [5], activation: 'relu' })
  );
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
};

const model = createAnomalyDetectionModel();

const detectAnomaly = async (inputData) => {
  const prediction = model.predict(tf.tensor(inputData, [1, 5]));
  const result = await prediction.data();
  if (result[0] > 0.5) {
    logEvent('보안 이상 징후 탐지됨');
    return true;
  }
  return false;
};

module.exports = detectAnomaly;
