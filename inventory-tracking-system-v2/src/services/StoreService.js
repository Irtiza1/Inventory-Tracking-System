const Store = require('../models/StoreModel');

const StoreService = {
  createStore: async (storeData) => {
    return Store.create(storeData);
  },
  getAllStores: async () => {
    return Store.findAll();
  },
  getStoreById: async (id) => {
    return Store.findById(id);
  },
  updateStore: async (id, storeData) => {
    return Store.update(id, storeData);
  },
  deleteStore: async (id) => {
    return Store.delete(id);
  },
};

module.exports = StoreService;
