const StockMovement = require('../models/StockMovementModel');
const Product = require('../models/ProductModel');

const StockMovementService = {
  createStockMovement: async (movementData) => {
    try {
      const product = await Product.getIdByProductCode(movementData.product_code);
      if (!product) {
        throw new Error('Product not found');
      }

      const newMovement = await StockMovement.recordMovement(product, movementData);
      return newMovement;
    } catch (error) {
      console.error('Error creating stock movement:', error);
      throw new Error('Failed to create stock movement');
    }
  },

  getAllStockMovements: async () => {
    try {
      const stockMovements = await StockMovement.getAllStockMovements();
      return stockMovements;
    } catch (error) {
      console.error('Error fetching all stock movements:', error);
      throw new Error('Failed to fetch stock movements');
    }
  },

  getStockMovementByProductCode: async (product_code) => {
    try {
      const product = await Product.getIdByProductCode(product_code);
      if (!product) {
        throw new Error('Product not found');
      }

      const stockMovements = await StockMovement.findById(product);
      return stockMovements;
    } catch (error) {
      console.error(`Error fetching stock movement for product_code "${product_code}":`, error);
      throw new Error('Failed to fetch stock movement by product code');
    }
  },

  getStockMovementByStoreId: async (store_id) => {
    try {
      const stockMovements = await StockMovement.findByStoreId(store_id);
      return stockMovements;
    } catch (error) {
      console.error(`Error fetching stock movement for store_id "${store_id}":`, error);
      throw new Error('Failed to fetch stock movement by store ID');
    }
  },

  deleteStockMovement: async (product_code) => {
    try {
      const product = await Product.getIdByProductCode(product_code);
      if (!product) {
        throw new Error('Product not found');
      }

      const deletedCount = await StockMovement.deleteStock(product);
      return deletedCount;
    } catch (error) {
      console.error(`Error deleting stock movement for product_code "${product_code}":`, error);
      throw new Error('Failed to delete stock movement');
    }
  },
};

module.exports = StockMovementService;


// const StockMovement = require('../models/StockMovementModel');
// const Product = require('../models/ProductModel');

// const StockMovementService = {
//   createStockMovement: async (movementData) => {
//     // Find the product by product_code
//     const product = await Product.getIdByProductCode(movementData.product_code);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Create a new stock movement
//     const newMovement = await StockMovement.recordMovement(product, movementData);
      

//     return newMovement;
//   },

//   getAllStockMovements: async () => {
//     // Fetch all stock movements
//     const stockMovements = await StockMovement.getAllStockMovements();
//     return stockMovements;
//   },

//   getStockMovementByProductCode: async (product_code) => {
//     // Find the product by product_code
//     const product = await Product.getIdByProductCode(product_code);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Fetch stock movements for the product
//     const stockMovements = await StockMovement.findById(product);
//     return stockMovements;
//   },

//   getStockMovementByStoreId: async (store_id) => {
//     // Fetch stock movements for the store
//     const stockMovements = await StockMovement.findByStoreId(store_id); // Using the updated method
//     return stockMovements;
//   },

//   deleteStockMovement: async (product_code) => {
//     // Find the product by product_code
//     const product = await Product.getIdByProductCode(product_code);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Delete stock movements for the product
//     const deletedCount = await StockMovement.deleteStock(product);

//     return deletedCount;
//   },
// };

// module.exports = StockMovementService;



// second opt
// const StockMovement = require('../models/StockMovementModel');
// const Product = require('../models/ProductModel');
// const StoreStock =  require('../models/StoreStockModel')
// const StockMovementService = {
//   recordStockMovement: async (movementData, t) => {
//     const product_id = await Product.getIdByProductCode(movementData.product_code);
//     if (!product_id) {
//       return { error: "Product not found" }; 
//     }
  
//     await StoreStock.StockAdjustment(product_id, movementData, t); 
  
//     return StockMovement.recordMovement(product_id, movementData, t);
//   },

//   getAllStockMovements: async (t) => {
//     return StockMovement.findAll(t);
//   },

//   getStockMovementByproductCode: async (product_code, t) => {
//     const product_id = await Product.getIdByProductCode(product_code);
//     if (!product_id) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     return StockMovement.findById(product_id, t);
//   },

//   getStockMovementByStoreId: async (StoreId, t) => {
//     return StockMovement.findByStoreId(StoreId, t);
//   },
//   // updateStockMovement: async (id, movementData, t) => {
//   //   return StockMovement.update(id, movementData, t);
//   // },

//   deleteStockMovement: async (product_code, t) => {
//     const product_id = await Product.getIdByProductCode(product_code);
//     if (!product_id) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     return StockMovement.delete(product_id, t);
//   },
// };

// module.exports = StockMovementService;


// const StockMovement = require('../models/StockMovementModel');

// const StockMovementService = {
//   createStockMovement: async (movementData) => {
//     return StockMovement.create(movementData);
//   },
//   getAllStockMovements: async () => {
//     return StockMovement.findAll();
//   },
//   getStockMovementById: async (id) => {
//     return StockMovement.findById(id);
//   },
//   updateStockMovement: async (id, movementData) => {
//     return StockMovement.update(id, movementData);
//   },
//   deleteStockMovement: async (id) => {
//     return StockMovement.delete(id);
//   },
// };

// module.exports = StockMovementService;


// // services/InventoryMovementService.js
// const InventoryMovementModel = require("../models/InventoryMovementModel");

// class InventoryMovementService {
//     // Record a new inventory movement
//     static async recordMovement(productId, movementType, quantity) {
//         try {
//             const movementId = await InventoryMovementModel.recordMovement(productId, movementType, quantity);
//             return { success: true, movementId };
//         } catch (err) {
//             throw new Error("Failed to record inventory movement: " + err.message);
//         }
//     }

//     // Get all movements for a product
//     static async getMovements(productId) {
//         try {
//             const movements = await InventoryMovementModel.getMovements(productId);
//             return movements;
//         } catch (err) {
//             throw new Error("Failed to fetch inventory movements: " + err.message);
//         }
//     }
// }

// module.exports = InventoryMovementService;