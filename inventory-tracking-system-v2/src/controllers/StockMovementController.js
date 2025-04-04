const StockMovementService = require('../services/stockMovementService');
const { validateStockMovement } = require('../validations/stockMovementValidation');

const StockMovementController = {
  createStockMovement: async (req, res) => {
    const { error } = validateStockMovement(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const movement = await StockMovementService.createStockMovement(req.body);
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
  getStockMovementById: async (req, res) => {
    try {
      const movement = await StockMovementService.getStockMovementById(req.params.id);
      if (!movement) return res.status(404).json({ error: 'Stock movement not found' });
      res.status(200).json(movement);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stock movement' });
    }
  },
  updateStockMovement: async (req, res) => {
    const { error } = validateStockMovement(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const movement = await StockMovementService.updateStockMovement(req.params.id, req.body);
      if (!movement) return res.status(404).json({ error: 'Stock movement not found' });
      res.status(200).json(movement);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update stock movement' });
    }
  },
  deleteStockMovement: async (req, res) => {
    try {
      const deleted = await StockMovementService.deleteStockMovement(req.params.id);
      if (deleted === 0) return res.status(404).json({ error: 'Stock movement not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete stock movement' });
    }
  },
};

module.exports = StockMovementController;
