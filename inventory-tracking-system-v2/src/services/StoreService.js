const Store = require('../models/StoreModel');

const StoreService = {
  createStore: async (storeDataproduct) => {
    try {
      return await Store.createStore(storeDataproduct);
    } catch (error) {
      console.error('Error creating store:', error);
      throw new Error('Failed to create store');
    }
  },

  getAllStores: async () => {
    try {
      return await Store.findAllStores();
    } catch (error) {
      console.error('Error fetching all stores:', error);
      throw new Error('Failed to fetch stores');
    }
  },

  getStoreByIdOrName: async (idOrNameproduct) => {
    try {
      return await Store.findByIdOrName(idOrNameproduct);
    } catch (error) {
      console.error(`Error fetching store by ID or name:`, error);
      throw new Error('Failed to fetch store');
    }
  },

  updateStoreByIdOrName: async (idOrName, storeDataproduct) => {
    try {
      return await Store.updateByIdOrName(idOrName, storeDataproduct);
    } catch (error) {
      console.error(`Error updating store with ID or name "${idOrName}":`, error);
      throw new Error('Failed to update store');
    }
  },

  deleteStoreByIdOrName: async (idOrNameproduct) => {
    try {
      return await Store.deleteByIdOrName(idOrNameproduct);
    } catch (error) {
      console.error(`Error deleting store with ID or name "${idOrNameproduct}":`, error);
      throw new Error('Failed to delete store');
    }
  },
};

module.exports = StoreService;

// const Store = require('../models/StoreModel');

// const StoreService = {
//   createStore: async (storeDataproduct) => {
//     return await Store.createStore(storeDataproduct);
//   },

//   getAllStores: async () => {
//     return await Store.findAllStores();
//   },

//   getStoreByIdOrName: async (idOrNameproduct) => {
//     return Store.findByIdOrName(idOrNameproduct);
//   },

//   updateStoreByIdOrName: async (idOrName, storeDataproduct) => {
//     return Store.updateByIdOrName(idOrName, storeDataproduct);
//   },

//   deleteStoreByIdOrName: async (idOrNameproduct) => {
//     return Store.deleteByIdOrName(idOrNameproduct);
//   },
// };

// module.exports = StoreService;


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
