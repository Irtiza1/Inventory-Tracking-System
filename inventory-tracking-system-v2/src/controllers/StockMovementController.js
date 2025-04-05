const StockMovementService = require('../services/StockMovementService');
const { validateStockMovement } = require('../validations/StockMovementValidation');

const StockMovementController = {
  recordStockMovement: async (req, res) => {
    const { error } = validateStockMovement(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const movement = await StockMovementService.recordStockMovement(req.body);
      res.status(201).json(movement);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create stock movement' });
    }
  },
  getAllStockMovements: async (req, res) => {
    try {
      const movements = await StockMovementService.getAllStockMovements();
      res.status(200).json(movements);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stock movements' });
    }
  },
  getStockMovementByProductCode: async (req, res) => {
    try {
      const movement = await StockMovementService.getStockMovementByproductCode(req.params.product_code);
      if (!movement) return res.status(404).json({ error: 'Stock movement not found' });
      res.status(200).json(movement);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stock movement' });
    }
  },
  getStockMovementByStoreId: async (req, res) => {
    try {
      const movement = await StockMovementService.getStockMovementByStoreId(req.params.store_id);
      if (!movement) return res.status(404).json({ error: 'Stock movement not found' });
      res.status(200).json(movement);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stock movement' });
    }
  },
  // updateStockMovement: async (req, res) => {
  //   const { error } = validateStockMovement(req.body);
  //   if (error) return res.status(400).json({ error: error.details[0].message });

  //   try {
  //     const movement = await StockMovementService.updateStockMovement(req.params.id, req.body);
  //     if (!movement) return res.status(404).json({ error: 'Stock movement not found' });
  //     res.status(200).json(movement);
  //   } catch (err) {
  //     res.status(500).json({ error: 'Failed to update stock movement' });
  //   }
  // },
  deleteStockMovement: async (req, res) => {
    try {
      const deleted = await StockMovementService.deleteStockMovement(req.params.product_code);
      if (deleted === 0) return res.status(404).json({ error: 'Stock movement not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete stock movement' });
    }
  },
};

module.exports = StockMovementController;
