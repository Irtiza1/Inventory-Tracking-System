const Supplier = require('../models/SupplierModel');

const SupplierService = {
  createSupplier: async (supplierData, t) => {
    return Supplier.create(supplierData, t);
  },

  getAllSuppliers: async (t) => {
    return Supplier.findAll(t);
  },

  getSupplierById: async (id, t) => {
    return Supplier.findById(id, t);
  },

  updateSupplier: async (id, supplierData, t) => {
    return Supplier.update(id, supplierData, t);
  },

  deleteSupplier: async (id, t) => {
    return Supplier.delete(id, t);
  },
};

module.exports = SupplierService;


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
