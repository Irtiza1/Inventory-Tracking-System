const ProductModel = require("../models/ProductModel");
const InventoryMovementModel = require("../models/InventoryMovementModel");
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
      const {productCode} = req.params
      // Basic validation
      // if (!id || isNaN(parseInt(id))) {
      //   return res.status(400).json({ error: "Invalid or missing ID" });
      // }
      if (!productCode) {
        return res.status(400).json({ error: "Invalid product code" });
      }
      const { data } = await ProductModel.getById(productCode);
      if (!data) return res.status(404).json({ error: "Product not found" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  },

  // Update stock
  updateStock: async (req, res) => {
      try {
          const { productCode,operation } = req.params;
          const { quantity } = req.body; // Added optional notes field

          // Enhanced validation
          // const productId = parseInt(id);
          // if (isNaN(productId) || productId <= 0) {
          //     return res.status(400).json({ error: "Invalid product ID" });
          // }
          if (!productCode) {
            return res.status(400).json({ error: "Invalid product code" });
          }
          if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
              return res.status(400).json({ error: "Quantity must be a positive integer" });
          }

          // Verify product exists first
          const product = await ProductModel.getById(productCode);
          if (!product) {
              return res.status(404).json({ error: "Product not found" });
          }

          if (operation === 'stock-in') {
            // Update stock
            await ProductModel.updateStock(productCode, quantity);
            
            // Record movement with additional context
            await InventoryMovementModel.recordMovement(productCode,"stock-in",quantity);
          }
          else if (operation === 'sale') {
            // Update stock
            await ProductModel.updateStock(productCode, -quantity);

            // Record movement with additional context
            await InventoryMovementModel.recordMovement(productCode, "sale",quantity);
          }
          else if (operation === 'manual-removal') {
            // Update stock
            await ProductModel.updateStock(productCode, -quantity);
            // Record movement with additional context
            await InventoryMovementModel.recordMovement(productCode,"manual-removal", quantity);
          }
          else {
            return res.status(400).json({ error: "Invalid operation" });
          }


          // Return updated stock info
          const updatedStock = await ProductModel.getCurrentStock(productCode);
          res.json({ 
              message: "Stock updated successfully",
              productCode,
              newQuantity: updatedStock
          });

      } catch (err) {
          console.error("Stock update error:", err);
          res.status(500).json({ 
              error: "Failed to update stock",
          });
      }
  },
  // // addStock: async (req, res) => {
  // //   try {
  // //     const {id} = req.params;
  // //     const { quantity } = req.body;
  // //     // Basic validation
  // //     if (!id || isNaN(parseInt(id))) {
  // //       return res.status(400).json({ error: "Invalid or missing ID" });
  // //     }
  // //     if (!quantity && quantity !== 0) {
  // //       return res.status(400).json({ error: "Quantity is required" });
  // //     }

  // //     const { changes } = await ProductModel.updateStock(id, quantity);
  // //     if (changes === 0) return res.status(404).json({ error: "Product not found" });
  // //     // Record movement
  // //     await InventoryMovementModel.recordMovement(id, "stock-in", quantity);
  // //     res.json({ message: "Stock Added" });
  // //   } catch (err) {
  // //     res.status(500).json({ error: "Failed to update stock" });
  // //   }
  // // },

  // // Sale product
  // saleProduct: async (req, res) => {
  //   try {
  //     const {id} = req.params;
  //     const { quantity } = req.body;
  //     // Basic validation
  //     if (!id || isNaN(parseInt(id))) {
  //       return res.status(400).json({ error: "Invalid or missing ID" });
  //     }
  //     if (!quantity && quantity !== 0) {
  //       return res.status(400).json({ error: "Quantity is required" });
  //     }

  //     const { changes } = await ProductModel.updateStock(id, quantity);
  //     if (changes === 0) return res.status(404).json({ error: "Product not found" });
  //     res.json({ message: "Stock Updated" });
  //   } catch (err) {
  //     res.status(500).json({ error: "Failed to update stock" });
  //   }
  // },

  // // remove product
  // removeProduct: async (req, res) => {
  //   try {
  //     const {id} = req.params;
  //     const { quantity } = req.body;
  //     // Basic validation
  //     if (!id || isNaN(parseInt(id))) {
  //       return res.status(400).json({ error: "Invalid or missing ID" });
  //     }
  //     if (!quantity && quantity !== 0) {
  //       return res.status(400).json({ error: "Quantity is required" });
  //     }

  //     const { changes } = await ProductModel.updateStock(id, quantity);
  //     if (changes === 0) return res.status(404).json({ error: "Product not found" });
  //     res.json({ message: "Stock Added" });
  //   } catch (err) {
  //     res.status(500).json({ error: "Failed to update stock" });
  //   }
  // },

  // Get current stock
  getCurrentStock: async (req, res) => {
    try {
      // Basic ID validation
      // const {id} = req.params;
      // if (!id || isNaN(parseInt(id))) {
      // return res.status(400).json({ error: "Invalid or missing ID" });
      // }

      const {productCode} = req.params
      // Basic validation
      if (!productCode) {
        return res.status(400).json({ error: "Invalid product code" });
      }
      const { data } = await ProductModel.getCurrentStock(productCode);
      if (!data) return res.status(404).json({ error: "Product not found" });
      res.json({ availableStock: data.available_quantity });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stock" });
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      // const {id} = req.params;
      // // Basic ID validation
      // if (!id || isNaN(parseInt(id))) {
      //   return res.status(400).json({ error: "Invalid or missing ID" });
      // }

      const {productCode} = req.params
      // Basic validation
      if (!productCode) {
        return res.status(400).json({ error: "Invalid product code" });
      }
      const { changes } = await ProductModel.delete(productCode);
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
