const StoreStock = require('../models/StoreStockModel');

const StoreStockService = {
  getAllStoreStock: async (t) => {
    return StoreStock.findAll(t);
  },

  getStock: async (storeId, productId, t) => {
    return StoreStock.findByStoreAndProduct(storeId, productId, t);
  },

  updateStockQuantity: async (storeId, productId, quantity, t) => {
    return StoreStock.updateQuantity(storeId, productId, quantity, t);
  },

  createStockEntry: async (stockData, t) => {
    return StoreStock.create(stockData, t);
  },

  stockAdjustment: async (storeId, productId, quantity, t) => {
    return StoreStock.StockAdjacement(storeId, productId, quantity, t);
  }
};

module.exports = StoreStockService;


// const StoreStock = require('../models/StoreStockModel');

// const StoreStockService = {
//   getAllStoreStock: async () => {
//     return StoreStock.findAll();
//   },

//   getStock: async (storeId, productId) => {
//     return StoreStock.findByStoreAndProduct(storeId, productId);
//   },

//   updateStockQuantity: async (storeId, productId, quantity) => {
//     return StoreStock.updateQuantity(storeId, productId, quantity);
//   },

//   createStockEntry: async (stockData) => {
//     return StoreStock.create(stockData);
//   },
// };

// module.exports = StoreStockService;
