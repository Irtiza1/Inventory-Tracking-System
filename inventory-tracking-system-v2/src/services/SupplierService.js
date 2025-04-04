const Supplier = require('../models/supplier');

const SupplierService = {
  createSupplier: async (supplierData) => {
    return Supplier.create(supplierData);
  },
  getAllSuppliers: async () => {
    return Supplier.findAll();
  },
  getSupplierById: async (id) => {
    return Supplier.findById(id);
  },
  updateSupplier: async (id, supplierData) => {
    return Supplier.update(id, supplierData);
  },
  deleteSupplier: async (id) => {
    return Supplier.delete(id);
  },
};

module.exports = SupplierService;
