// services/productService.js
const Product = require('../models/ProductModel');
console.log("5")
const ProductService = {
  createProduct: async (productData) => {
    return Product.create(productData);
  },
  getAllProducts: async () => {
    return Product.findAll();
  },
  getProductById: async (id) => {
    return Product.findById(id);
  },
  updateProduct: async (id, productData) => {
    return Product.update(id, productData);
  },
  deleteProduct: async (id) => {
    return Product.delete(id);
  },
};

module.exports = ProductService;


// // services/ProductService.js
// const ProductModel = require("../models/ProductModel");

// class ProductService {
//     // Create a new product
//     static async createProduct({ name, productCode, price, initialQuantity }) {
//         try {
//             const productId = await ProductModel.create(name, productCode, price, initialQuantity);
//             return { success: true, productId };
//         } catch (err) {
//             throw new Error("Failed to create product: " + err.message);
//         }
//     }

//     // Get all products
//     static async getAllProducts() {
//         try {
//             const products = await ProductModel.getAll();
//             return products;
//         } catch (err) {
//             throw new Error("Failed to fetch products: " + err.message);
//         }
//     }

//     // Get product by ID
//     static async getProductById(id) {
//         try {
//             const product = await ProductModel.getById(id);
//             if (!product) throw new Error("Product not found");
//             return product;
//         } catch (err) {
//             throw new Error("Failed to fetch product: " + err.message);
//         }
//     }

//     // Update product stock (increment/decrement)
//     static async updateStock(productId, quantity, movementType) {
//         try {
//             await ProductModel.updateStock(productId, quantity, movementType);
//             return { success: true };
//         } catch (err) {
//             throw new Error("Failed to update stock: " + err.message);
//         }
//     }

//     // Get current available stock
//     static async getCurrentStock(productId) {
//         try {
//             const stock = await ProductModel.getCurrentStock(productId);
//             if (!stock) throw new Error("Product not found");
//             return { availableStock: stock.available_quantity };
//         } catch (err) {
//             throw new Error("Failed to fetch stock: " + err.message);
//         }
//     }
// }

// module.exports = ProductService;