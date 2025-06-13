import invoices from '../mockData/invoices.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...invoices];

const invoiceService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const invoice = data.find(item => item.id === id);
    return invoice ? { ...invoice } : null;
  },

  async create(invoice) {
    await delay(300);
    const newInvoice = {
      ...invoice,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    data.unshift(newInvoice);
    return { ...newInvoice };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(200);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    data.splice(index, 1);
    return true;
  },

  async getTodaysRevenue() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const todaysInvoices = data.filter(invoice => 
      invoice.date.startsWith(today)
    );
    return todaysInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }
};

export default invoiceService;