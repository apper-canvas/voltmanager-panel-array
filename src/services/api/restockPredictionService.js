import restockPredictions from '../mockData/restockPredictions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...restockPredictions];

const restockPredictionService = {
  async getAll() {
    await delay(400);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const prediction = data.find(item => item.productId === id);
    return prediction ? { ...prediction } : null;
  },

  async generatePredictions() {
    await delay(500);
    // Simulate AI prediction generation
    return [...data];
  },

  async updatePrediction(productId, updates) {
    await delay(300);
    const index = data.findIndex(item => item.productId === productId);
    if (index === -1) {
      throw new Error('Prediction not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  }
};

export default restockPredictionService;