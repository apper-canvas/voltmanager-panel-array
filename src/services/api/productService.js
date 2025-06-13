import products from '../mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...products];

const productService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const product = data.find(item => item.id === id);
    return product ? { ...product } : null;
  },

  async create(product) {
    await delay(300);
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    data.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(200);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    data.splice(index, 1);
    return true;
  },

  async updateStock(id, quantity) {
    await delay(200);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    data[index].stock += quantity;
    return { ...data[index] };
  },

  async getLowStockProducts() {
    await delay(200);
    return data.filter(product => product.stock <= product.minStock).map(p => ({ ...p }));
  }
};

export default productService;