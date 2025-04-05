const ProductService = require('../services/ProductService');
const { validateProduct } = require('../validations/ProductValidation');
console.log("3")
const ProductController = {
  createProduct: async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      console.log("3.1")
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      console.error("🔥 Error in getAllProducts:", err); // Log the actual error
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  },
  updateProduct: async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
};

module.exports = ProductController;


// const ProductService = require('../services/productService');
// const Joi = require('joi');

// // Validation schemas using Joi
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

// const ProductController = {
//   // Create a new product
//   createProduct: async (req, res) => {
//     try {
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
//   getAllProducts: async (req, res) => {
//     try {
//       const products = await ProductService.getAllProducts();
//       res.json(products);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get product by ID
//   getProductById: async (req, res) => {
//     try {
//       const product = await ProductService.getProductById(req.params.id);
//       if (!product) return res.status(404).json({ error: 'Product not found' });
//       res.status(200).json(product);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Update product details
//   updateProduct: async (req, res) => {
//     try {
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

//       const result = await ProductService.updateProduct(req.params.id, value);
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Delete product
//   deleteProduct: async (req, res) => {
//     try {
//       await ProductService.deleteProduct(req.params.id);
//       res.status(204).send();
//     } catch (err) {
//       res.status(500).json({ error: err.message });
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
