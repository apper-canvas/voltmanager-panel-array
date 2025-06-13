import technicians from '../mockData/technicians.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...technicians];

const technicianService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const technician = data.find(item => item.id === id);
    return technician ? { ...technician } : null;
  },

  async create(technician) {
    await delay(300);
    const newTechnician = {
      ...technician,
      id: Date.now().toString(),
      status: 'available'
    };
    data.unshift(newTechnician);
    return { ...newTechnician };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Technician not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(200);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Technician not found');
    }
    data.splice(index, 1);
    return true;
  },

  async getAvailableTechnicians() {
    await delay(200);
    return data.filter(tech => tech.status === 'available').map(t => ({ ...t }));
  }
};

export default technicianService;