import repairOrders from '../mockData/repairOrders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...repairOrders];

const repairOrderService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const order = data.find(item => item.id === id);
    return order ? { ...order } : null;
  },

  async create(order) {
    await delay(300);
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: 'pending'
    };
    data.unshift(newOrder);
    return { ...newOrder };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Repair order not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(200);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Repair order not found');
    }
    data.splice(index, 1);
    return true;
return true;
  },

  async getPendingOrders() {
    await delay(200);
    return data.filter(order => order.status === 'pending').map(o => ({ ...o }));
  },

  async assignTechnician(orderId, technicianId) {
    await delay(200);
    const index = data.findIndex(item => item.id === orderId);
    if (index === -1) {
      throw new Error('Repair order not found');
    }
    data[index] = { ...data[index], assignedTechnician: technicianId };
    return { ...data[index] };
  },

  async updateTimeSpent(orderId, timeSpent) {
    await delay(200);
    const index = data.findIndex(item => item.id === orderId);
    if (index === -1) {
      throw new Error('Repair order not found');
    }
    data[index] = { ...data[index], timeSpent };
    return { ...data[index] };
  }

export default repairOrderService;