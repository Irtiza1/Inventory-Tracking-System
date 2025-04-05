const StockMovement = require('../models/StockMovementModel');

const StockMovementService = {
  createStockMovement: async (movementData, t) => {
    return StockMovement.create(movementData, t);
  },

  getAllStockMovements: async (t) => {
    return StockMovement.findAll(t);
  },

  getStockMovementById: async (id, t) => {
    return StockMovement.findById(id, t);
  },

  updateStockMovement: async (id, movementData, t) => {
    return StockMovement.update(id, movementData, t);
  },

  deleteStockMovement: async (id, t) => {
    return StockMovement.delete(id, t);
  },
};

module.exports = StockMovementService;


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