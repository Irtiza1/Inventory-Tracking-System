const Store = require('../models/StoreModel');

const StoreService = {
  createStore: async (storeDataproduct) => {
    const userId = req.user.id;
    try {
      return await Store.createStore(storeDataproduct,userId);
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
    const userId = req.user.id;
    try {
      return await Store.updateByIdOrName(idOrName, storeDataproduct,userId);
    } catch (error) {
      console.error(`Error updating store with ID or name "${idOrName}":`, error);
      throw new Error('Failed to update store');
    }
  },

  deleteStoreByIdOrName: async (idOrNameproduct) => {
    const userId = req.user.id;
    try {
      return await Store.deleteByIdOrName(idOrNameproduct,userId);
    } catch (error) {
      console.error(`Error deleting store with ID or name "${idOrNameproduct}":`, error);
      throw new Error('Failed to delete store');
    }
  },
};

module.exports = StoreService;
