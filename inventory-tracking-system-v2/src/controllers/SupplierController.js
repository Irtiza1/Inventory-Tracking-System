const SupplierService = require('../services/supplierService');
const { validateSupplier } = require('../validations/supplierValidation');

const SupplierController = {
  createSupplier: async (req, res) => {
    const { error } = validateSupplier(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const supplier = await SupplierService.createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create supplier' });
    }
  },
  getAllSuppliers: async (req, res) => {
    try {
      const suppliers = await SupplierService.getAllSuppliers();
      res.status(200).json(suppliers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve suppliers' });
    }
  },
  getSupplierById: async (req, res) => {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id);
      if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
      res.status(200).json(supplier);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve supplier' });
    }
  },
  updateSupplier: async (req, res) => {
    const { error } = validateSupplier(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const supplier = await SupplierService.updateSupplier(req.params.id, req.body);
      if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
      res.status(200).json(supplier);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update supplier' });
    }
  },
  deleteSupplier: async (req, res) => {
    try {
      const deleted = await SupplierService.deleteSupplier(req.params.id);
      if (deleted === 0) return res.status(404).json({ error: 'Supplier not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete supplier' });
    }
  },
};

module.exports = SupplierController;
