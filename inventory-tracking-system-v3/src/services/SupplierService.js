const Supplier = require('../models/SupplierModel');

const SupplierService = {
  createSupplier: async (supplierData) => {
    try {
      return await Supplier.createSupplier(supplierData);
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw new Error('Failed to create supplier');
    }
  },

  getAllSuppliers: async () => {
    try {
      return await Supplier.findAllSuppliers();
    } catch (error) {
      console.error('Error fetching all suppliers:', error);
      throw new Error('Failed to fetch suppliers');
    }
  },

  getSupplierById: async (id) => {
    try {
      return await Supplier.findById(id);
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw new Error(`Failed to fetch supplier with ID ${id}`);
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      return await Supplier.updateSupplier(id, supplierData);
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw new Error(`Failed to update supplier with ID ${id}`);
    }
  },

  deleteSupplier: async (id) => {
    try {
      return await Supplier.deleteSupplier(id);
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw new Error(`Failed to delete supplier with ID ${id}`);
    }
  },
};

module.exports = SupplierService;

