const StockMovement = require('../models/StockMovementModel');
const Product = require('../models/ProductModel');

const StockMovementService = {
  createStockMovement: async (movementData) => {
    const userId = req.user.id;
    try {
      const product = await Product.getIdByProductCode(movementData.product_code);
      if (!product) {
        throw new Error('Product not found');
      }

      const newMovement = await StockMovement.recordMovement(product, {... movementData, userId});
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
    const userId = req.user.id;
    try {
      const product = await Product.getIdByProductCode(product_code);
      if (!product) {
        throw new Error('Product not found');
      }

      const deletedCount = await StockMovement.deleteStock(product,userId);
      return deletedCount;
    } catch (error) {
      console.error(`Error deleting stock movement for product_code "${product_code}":`, error);
      throw new Error('Failed to delete stock movement');
    }
  },
};

module.exports = StockMovementService;

