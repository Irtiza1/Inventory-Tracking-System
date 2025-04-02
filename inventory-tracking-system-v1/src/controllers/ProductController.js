const ProductModel = require("../models/ProductModel");

const ProductController = {
  // Create product
  create: async (req, res) => {
    try {
      const { name, productCode, price, initialQuantity } = req.body;
      
      // Basic validation
      if (!name || !productCode || !price || initialQuantity === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { lastID } = await ProductModel.create(req.body);
      res.status(201).json({ productId: lastID });
    } catch (err) {
      res.status(500).json({ error: "Failed to create product" });
    }
  },

  // Get all products
  getAll: async (req, res) => {
    try {
      const { data } = await ProductModel.getAll();
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  },

  // Get product by ID
  getById: async (req, res) => {
    try {
      const { data } = await ProductModel.getById(req.params.id);
      if (!data) return res.status(404).json({ error: "Product not found" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  },

  // Update stock
  updateStock: async (req, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity && quantity !== 0) {
        return res.status(400).json({ error: "Quantity is required" });
      }

      const { changes } = await ProductModel.updateStock(req.params.productId, quantity);
      if (changes === 0) return res.status(404).json({ error: "Product not found" });
      res.json({ message: "Stock updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update stock" });
    }
  },

  // Get current stock
  getCurrentStock: async (req, res) => {
    try {
      const { data } = await ProductModel.getCurrentStock(req.params.productId);
      if (!data) return res.status(404).json({ error: "Product not found" });
      res.json({ availableStock: data.available_quantity });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  },

  // Delete product
  delete: async (req, res) => {
    try {
      const { changes } = await ProductModel.delete(req.params.id);
      if (changes === 0) return res.status(404).json({ error: "Product not found" });
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
};

module.exports = ProductController;

// const ProductModel = require("../models/ProductModel");

// const ProductController = {
//   // Create product
//   create: async (req, res) => {
//     try {
//       const { name, productCode, price, initialQuantity } = req.body;
      
//       // Basic validation
//       if (!name || !productCode || !price || initialQuantity === undefined) {
//         return res.status(400).json({ error: "Missing fields" });
//       }

//       const productId = await ProductModel.create(name, productCode, price, initialQuantity);
//       res.status(201).json({ productId });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get all products
//   getAll: async (req, res) => {
//     try {
//       const products = await ProductModel.getAll();
//       res.json(products);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch products" });
//     }
//   },

//   // Get product by ID
//   getById: async (req, res) => {
//     try {
//       const product = await ProductModel.getById(req.params.id);
//       if (!product) return res.status(404).json({ error: "Product not found" });
//       res.json(product);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch product" });
//     }
//   },

//   // Update stock
//   updateStock: async (req, res) => {
//     try {
//       const { productId } = req.params;
//       const { quantity } = req.body;
      
//       if (!quantity) {
//         return res.status(400).json({ error: "Quantity required" });
//       }

//       await ProductModel.updateStock(productId, quantity);
//       res.json({ message: "Stock updated" });
//     } catch (err) {
//       res.status(500).json({ error: "Failed to update stock" });
//     }
//   },

//   // Get current stock (added)
//   getCurrentStock: async (req, res) => {
//     try {
//       const stock = await ProductModel.getCurrentStock(req.params.productId);
//       if (stock === undefined || stock === null) {
//         return res.status(404).json({ error: "Product not found" });
//       }
//       res.json({ availableStock: stock });
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch stock" });
//     }
//   }
// };

// module.exports = ProductController;

// // controllers/ProductController.js
// const Joi = require('joi');
// const ProductService = require("../services/ProductService");

// // Define Joi validation schemas
// const productCreateSchema = Joi.object({
//   name: Joi.string().trim().required().messages({
//     'string.empty': 'Name is required',
//     'any.required': 'Name is required'
//   }),
//   productCode: Joi.string().trim().required().messages({
//     'string.empty': 'Product code is required',
//     'any.required': 'Product code is required'
//   }),
//   price: Joi.number().required().messages({
//     'number.base': 'Price must be a number',
//     'any.required': 'Price is required'
//   }),
//   initialQuantity: Joi.number().integer().min(0).required().messages({
//     'number.base': 'Quantity must be an integer',
//     'number.min': 'Quantity must be a positive integer',
//     'any.required': 'Quantity is required'
//   })
// });

// const stockUpdateSchema = Joi.object({
//   quantity: Joi.number().integer().required().messages({
//     'number.base': 'Quantity must be an integer',
//     'any.required': 'Quantity is required'
//   }),
//   movementType: Joi.string().trim().required().messages({
//     'string.empty': 'Movement type is required',
//     'any.required': 'Movement type is required'
//   })
// });

// const ProductController = {
//   // Create a new product
//   create: async (req, res) => {
//     try {
//       // Validate request body
//       const { error, value } = productCreateSchema.validate(req.body, { 
//         abortEarly: false 
//       });
      
//       if (error) {
//         const errors = error.details.map(detail => ({
//           field: detail.path[0],
//           message: detail.message
//         }));
//         return res.status(400).json({ errors });
//       }

//       const result = await ProductService.createProduct(value);
//       res.status(201).json(result);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get all products
//   getAll: async (req, res) => {
//     try {
//       const products = await ProductService.getAllProducts();
//       res.json(products);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get product by ID
//   getById: async (req, res) => {
//     try {
//       const product = await ProductService.getProductById(req.params.id);
//       res.json(product);
//     } catch (err) {
//       if (err.message === "Product not found") {
//         res.status(404).json({ error: err.message });
//       } else {
//         res.status(500).json({ error: err.message });
//       }
//     }
//   },

//   // Update stock (increment/decrement)
//   updateStock: async (req, res) => {
//     try {
//       // Validate request body
//       const { error, value } = stockUpdateSchema.validate(req.body, {
//         abortEarly: false
//       });
      
//       if (error) {
//         const errors = error.details.map(detail => ({
//           field: detail.path[0],
//           message: detail.message
//         }));
//         return res.status(400).json({ errors });
//       }

//       const { productId } = req.params;
//       await ProductService.updateStock(productId, value.quantity, value.movementType);
//       res.json({ message: "Stock updated successfully" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get current stock
//   getCurrentStock: async (req, res) => {
//     try {
//       const stock = await ProductService.getCurrentStock(req.params.productId);
//       res.json(stock);
//     } catch (err) {
//       if (err.message === "Product not found") {
//         res.status(404).json({ error: err.message });
//       } else {
//         res.status(500).json({ error: err.message });
//       }
//     }
//   }
// };

// module.exports = ProductController;



// const ProductModel = require("../models/ProductModel");
// const { body, validationResult } = require("express-validator");

// const ProductController = {
//     // Create a new product
//     create: [
//         // Validation middleware
//         body("name").isString().trim().notEmpty(),
//         body("productCode").isString().trim().notEmpty(),
//         body("price").isNumeric().notEmpty(),
//         body("initialQuantity").isInt({ min: 0 }),

//         (req, res) => {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ errors: errors.array() });
//             }

//             const { name, productCode, price, initialQuantity } = req.body;
//             ProductModel.create(name, productCode, price, initialQuantity, (err, productId) => {
//                 if (err) return res.status(500).json({ error: "Database error" });
//                 res.status(201).json({ message: "Product created", productId });
//             });
//         }
//     ],

//     // Get all products
//     getAll: (req, res) => {
//         ProductModel.getAll((err, products) => {
//             if (err) return res.status(500).json({ error: "Database error" });
//             res.json(products);
//         });
//     },

//     // Get product by ID
//     getById: (req, res) => {
//         const { id } = req.params;
//         ProductModel.getById(id, (err, product) => {
//             if (err) return res.status(500).json({ error: "Database error" });
//             if (!product) return res.status(404).json({ error: "Product not found" });
//             res.json(product);
//         });
//     },

//     // Update stock
//     updateStock: [
//         body("quantity").isInt(),
//         body("movementType").isString().trim().notEmpty(),

//         (req, res) => {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ errors: errors.array() });
//             }

//             const { productId } = req.params;
//             const { quantity, movementType } = req.body;

//             ProductModel.updateStock(productId, quantity, movementType, (err) => {
//                 if (err) return res.status(500).json({ error: "Database error" });
//                 res.json({ message: "Stock updated successfully" });
//             });
//         }
//     ],

//     // Get current stock
//     getCurrentStock: (req, res) => {
//         const { productId } = req.params;
//         ProductModel.getCurrentStock(productId, (err, result) => {
//             if (err) return res.status(500).json({ error: "Database error" });
//             if (!result) return res.status(404).json({ error: "Product not found" });
//             res.json({ availableStock: result.available_quantity });
//         });
//     }
// };

// module.exports = ProductController;
