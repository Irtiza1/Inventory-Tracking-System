const StoreService = require('../services/StoreService');
const { validateStore } = require('../validations/StoreValidation');

const StoreController = {
  createStore: async (req, res) => {
    const { error } = validateStore(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const store = await StoreService.createStore(req.body);
      res.status(201).json(store);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create store' });
    }
  },
  getAllStores: async (req, res) => {
    try {
      const stores = await StoreService.getAllStores();
      res.status(200).json(stores);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stores' });
    }
  },
  getStoreById: async (req, res) => {
    try {
      const store = await StoreService.getStoreById(req.params.id);
      if (!store) return res.status(404).json({ error: 'Store not found' });
      res.status(200).json(store);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve store' });
    }
  },
  updateStore: async (req, res) => {
    const { error } = validateStore(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const store = await StoreService.updateStore(req.params.id, req.body);
      if (!store) return res.status(404).json({ error: 'Store not found' });
      res.status(200).json(store);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update store' });
    }
  },
  deleteStore: async (req, res) => {
    try {
      const deleted = await StoreService.deleteStore(req.params.id);
      if (deleted === 0) return res.status(404).json({ error: 'Store not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete store' });
    }
  },
};

module.exports = StoreController;
