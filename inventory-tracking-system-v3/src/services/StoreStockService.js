const StoreStock = require('../models/StoreStockModel');
const Product = require('../models/ProductModel');

const StoreStockService = {
  getAllStoreStock: async () => {
    try {
      return await StoreStock.findAllStoreStocks();
    } catch (error) {
      console.error('Error fetching all store stocks:', error);
      throw new Error('Failed to fetch store stocks');
    }
  },

  getStock: async (storeId, product_code) => {
    try {
      const product_id = await Product.getIdByProductCode(product_code);
      if (!product_id) {
        return { error: "Product not found" };
      }
      return await StoreStock.findByStoreAndProduct(storeId, product_id);
    } catch (error) {
      console.error(`Error getting stock for store ${storeId} and product ${product_code}:`, error);
      throw new Error('Failed to get store stock');
    }
  },

  updateStockQuantity: async (storeId, product_code, quantity) => {
    const userId = req.user.id;
    try {
      const product_id = await Product.getIdByProductCode(product_code);
      if (!product_id) {
        return { error: "Product not found" };
      }
      return await StoreStock.updateQuantity(storeId, product_code, quantity, userId);
    } catch (error) {
      console.error(`Error updating stock quantity for store ${storeId} and product ${product_code}:`, error);
      throw new Error('Failed to update store stock quantity');
    }
  },

  createStockEntry: async (stockDataproduct) => {
    const userId = req.user.id;
    try {
      const product_id = await Product.getIdByProductCode(stockDataproduct.product_code);
      if (!product_id) {
        return { error: "Product not found" };
      }
      return await StoreStock.createStoreStock(product_id, { ...stockDataproduct, user_id: userId });
    } catch (error) {
      console.error('Error creating store stock entry:', error);
      throw new Error('Failed to create store stock entry');
    }
  },

  stockAdjustment: async (product_code, movementproduct) => {
    try {
      const product_id = await Product.getIdByProductCode(product_code);
      if (!product_id) {
        return { error: "Product not found" };
      }
      return await StoreStock.StockAdjustment(product_id, movementproduct);
    } catch (error) {
      console.error(`Error adjusting stock for product ${product_code}:`, error);
      throw new Error('Failed to perform stock adjustment');
    }
  },

  deleteStoreStock: async (storeId, product_code) => {
    const userId = req.user.id;
    try {
      const product_id = await Product.getIdByProductCode(product_code);
      if (!product_id) {
        return { error: "Product not found" };
      }
      return await StoreStock.deleteStoreStock(storeId, product_id,userId);
    } catch (error) {
      console.error(`Error deleting store stock for store ${storeId} and product ${product_code}:`, error);
      throw new Error('Failed to delete store stock');
    }
  },
};

module.exports = StoreStockService;
