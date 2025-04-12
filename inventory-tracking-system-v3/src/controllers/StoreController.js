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
  getStoreByIdOrName: async (req, res) => {
    const { idOrName } = req.params;
    const searchParam = /^\d+$/.test(idOrName)
      ? { id: parseInt(idOrName, 10) }
      : { name: idOrName };

    try {
      const store = await StoreService.getStoreByIdOrName(searchParam);
      if (!store) return res.status(404).json({ error: 'Store not found' });
      res.status(200).json(store);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve store' });
    }
  },
  updateStoreByIdOrName: async (req, res) => {
    const { error } = validateStore(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { idOrName } = req.params;
    const searchParam = /^\d+$/.test(idOrName)
      ? { id: parseInt(idOrName, 10) }
      : { name: idOrName };

    try {
      const updated = await StoreService.updateStoreByIdOrName(searchParam, req.body);
      if (!updated) return res.status(404).json({ error: 'Store not found' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update store' });
    }
  },
  deleteStoreByIdOrName: async (req, res) => {
    const { idOrName } = req.params;
    const searchParam = /^\d+$/.test(idOrName)
      ? { id: parseInt(idOrName, 10) }
      : { name: idOrName };

    try {
      const deleted = await StoreService.deleteStoreByIdOrName(searchParam);
      if (deleted === 0) return res.status(404).json({ error: 'Store not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete store' });
    }
  },
};

module.exports = StoreController;
