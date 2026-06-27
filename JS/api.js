/* js/api.js — All backend calls through Google Apps Script */
const API = {
  url: CONFIG.SCRIPT_URL,

  async get(params) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${this.url}?${qs}`);
    if (!res.ok) throw new Error('Network error');
    return res.json();
  },

  async post(data) {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Network error');
    return res.json();
  },

  async getAllStoreData(sheetId) {
    return this.get({ action: 'getAllData', sheetId });
  },

  async getStores() {
    return this.get({ action: 'getStores' });
  },

  async getStore(storeId) {
    return this.get({ action: 'getStore', storeId });
  },

  async saveSetting(sheetId, key, value, password) {
    return this.post({ action: 'saveSettings', sheetId, key, value, password });
  },

  async saveProduct(sheetId, product, password) {
    return this.post({ action: 'saveProduct', sheetId, product, password });
  },

  async deleteProduct(sheetId, productId, password) {
    return this.post({ action: 'deleteProduct', sheetId, productId, password });
  },

  async saveBanner(sheetId, banner, password) {
    return this.post({ action: 'saveBanner', sheetId, banner, password });
  },

  async deleteBanner(sheetId, bannerId, password) {
    return this.post({ action: 'deleteBanner', sheetId, bannerId, password });
  },

  async saveCategory(sheetId, category, password) {
    return this.post({ action: 'saveCategory', sheetId, category, password });
  },

  async deleteCategory(sheetId, categoryId, password) {
    return this.post({ action: 'deleteCategory', sheetId, categoryId, password });
  },

  async createStore(storeName, sheetId, adminPassword) {
    return this.post({
      action: 'createStore',
      storeName, sheetId, adminPassword,
      password: CONFIG.MASTER_PASSWORD,
    });
  },

  async updateStore(storeId, field, value) {
    return this.post({
      action: 'updateStore',
      storeId, field, value,
      password: CONFIG.MASTER_PASSWORD,
    });
  },
};