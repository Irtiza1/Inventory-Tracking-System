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


// const Supplier = require('../models/SupplierModel');

// const SupplierService = {
//   createSupplier: async (supplierData) => {
//     return Supplier.createSupplier(supplierData);
//   },

//   getAllSuppliers: async () => {
//     return Supplier.findAllSuppliers();
//   },

//   getSupplierById: async (id) => {
//     return Supplier.findById(id);
//   },

//   updateSupplier: async (id, supplierData) => {
//     return Supplier.updateSupplier(id, supplierData);
//   },

//   deleteSupplier: async (id) => {
//     return Supplier.deleteSupplier(id);
//   },
// };

// module.exports = SupplierService;


// const Supplier = require('../models/SupplierModel');

// const SupplierService = {
//   createSupplier: async (supplierData) => {
//     return Supplier.create(supplierData);
//   },
//   getAllSuppliers: async () => {
//     return Supplier.findAll();
//   },
//   getSupplierById: async (id) => {
//     return Supplier.findById(id);
//   },
//   updateSupplier: async (id, supplierData) => {
//     return Supplier.update(id, supplierData);
//   },
//   deleteSupplier: async (id) => {
//     return Supplier.delete(id);
//   },
// };

// module.exports = SupplierService;
