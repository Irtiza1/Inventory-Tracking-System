const StoreStockService = require('../services/StoreStockService');
const { validateStoreStock } = require('../validations/StoreStockValidation');

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
    const { storeId, product_code } = req.params;
    try {
      const stock = await StoreStockService.getStock(storeId, product_code);
      if (!stock) return res.status(404).json({ error: 'Stock not found' });
      res.status(200).json(stock);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get stock info' });
    }
  },

  updateStock: async (req, res) => {
    const { quantity } = req.body;

    const { error } = Joi.object({
      quantity: Joi.number().integer().min(0).required().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity cannot be negative',
        'any.required': 'Quantity is required'
      })
    }).validate({ quantity });

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { storeId, product_code } = req.params;

    try {
      const updated = await StoreStockService.updateStockQuantity(storeId, product_code, quantity);
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update stock quantity' });
    }
  },
  stockAdjustment: async (movement) => {
    const { quantity } = movement.quantity;

    const { error } = Joi.object({
      quantity: Joi.number().integer().min(0).required().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity cannot be negative',
        'any.required': 'Quantity is required'
      })
    }).validate({ quantity });

    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const updated = await StoreStockService.stockAdjustment(movement.product_code, movement);
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update stock quantity' });
    }
  },

  createStock: async (req, res) => {
    const { error } = validateStoreStock(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
  
    try {
      const created = await StoreStockService.createStockEntry(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create stock entry' });
    }
  },

  deleteStoreStock: async (req, res) => {
    const { storeId, product_code } = req.params;
    try {
      const deleted = await StoreStockService.deleteStoreStock(storeId, product_code);
      if (!deleted) return res.status(404).json({ error: 'Stock not found' });
      res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete stock' });
    }
  },
};

module.exports = StoreStockController;
