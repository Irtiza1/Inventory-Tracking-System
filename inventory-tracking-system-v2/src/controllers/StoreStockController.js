const StoreStockService = require('../services/StoreStockService');

const StoreStockController = {
  getAllStock: async (req, res) => {
    try {
      const data = await StoreStockService.getAllStoreStock();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve store stock' });
    }
  },

  getStock: async (req, res) => {
    const { storeId, productId } = req.params;
    try {
      const stock = await StoreStockService.getStock(storeId, productId);
      if (!stock) return res.status(404).json({ error: 'Stock not found' });
      res.status(200).json(stock);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get stock info' });
    }
  },

  updateStock: async (req, res) => {
    const { storeId, productId } = req.params;
    const { quantity } = req.body;
    try {
      const updated = await StoreStockService.updateStockQuantity(storeId, productId, quantity);
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update stock quantity' });
    }
  },

  createStock: async (req, res) => {
    try {
      const created = await StoreStockService.createStockEntry(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create stock entry' });
    }
  },
};

module.exports = StoreStockController;
