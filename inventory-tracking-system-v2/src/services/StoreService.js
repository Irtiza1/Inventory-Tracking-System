const Store = require('../models/StoreModel');

const StoreService = {
  createStore: async (storeData, t) => {
    return Store.create(storeData, t);
  },

  getAllStores: async (t) => {
    return Store.findAll(t);
  },

  getStoreById: async (id, t) => {
    return Store.findById(id, t);
  },

  updateStore: async (id, storeData, t) => {
    return Store.update(id, storeData, t);
  },

  deleteStore: async (id, t) => {
    return Store.delete(id, t);
  },
};

module.exports = StoreService;


// const Store = require('../models/StoreModel');

// const StoreService = {
//   createStore: async (storeData) => {
//     return Store.create(storeData);
//   },
//   getAllStores: async () => {
//     return Store.findAll();
//   },
//   getStoreById: async (id) => {
//     return Store.findById(id);
//   },
//   updateStore: async (id, storeData) => {
//     return Store.update(id, storeData);
//   },
//   deleteStore: async (id) => {
//     return Store.delete(id);
//   },
// };

// module.exports = StoreService;
