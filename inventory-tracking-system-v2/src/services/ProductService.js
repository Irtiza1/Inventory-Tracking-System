// services/productService.js
const Product = require('../models/ProductModel');

const ProductService = {
  createProduct: async (productData) => {
    try {
      const newProduct = await Product.createProduct(productData);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },

  getAllProducts: async () => {
    try {
      const products = await Product.findAllProducts();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  getProductByProductCode: async (product_code) => {
    try {
      const product = await Product.findByProductCode(product_code);
      return product;
    } catch (error) {
      console.error(`Error fetching product with code "${product_code}":`, error);
      throw new Error('Failed to fetch product by product code');
    }
  },

  getProductBySupplierId: async (supplier_id) => {
    try {
      const products = await Product.findBySupplierId(supplier_id);
      return products;
    } catch (error) {
      console.error(`Error fetching products for supplier ID "${supplier_id}":`, error);
      throw new Error('Failed to fetch products by supplier ID');
    }
  },

  getIdByProductCode: async (product_code) => {
    try {
      const productId = await Product.getIdByProductCode(product_code);
      return productId;
    } catch (error) {
      console.error(`Error fetching product ID for code "${product_code}":`, error);
      throw new Error('Failed to fetch product ID by product code');
    }
  },

  updateProduct: async (product_code, productData) => {
    try {
      const updatedProduct = await Product.updateProduct(product_code, productData);
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product with code "${product_code}":`, error);
      throw new Error('Failed to update product');
    }
  },

  deleteProduct: async (product_code) => {
    try {
      const deletedCount = await Product.deleteProduct(product_code);
      return deletedCount;
    } catch (error) {
      console.error(`Error deleting product with code "${product_code}":`, error);
      throw new Error('Failed to delete product');
    }
  },
};

module.exports = ProductService;

// // services/productService.js
// const Product = require('../models/ProductModel');

// const ProductService = {
//   createProduct: async (productData) => {
//     // Use the ORM method to create a new product
//     const newProduct = await Product.createProduct(productData);
//     return newProduct;
//   },

//   getAllProducts: async () => {
//     // Use the ORM method to get all products
//     const products = await Product.findAllProducts();
//     return products;
//   },

//   getProductByProductCode: async (product_code) => {
//     // Use the ORM method to get a product by product_code
//     const product = await Product.findByProductCode(product_code);
//     return product;
//   },

//   getProductBySupplierId: async (supplier_id) => {
//     // Use the ORM method to get products by supplier_id
//     const products = await Product.findBySupplierId(supplier_id);
//     return products;
//   },

//   getIdByProductCode: async (product_code) => {
//     // Use the ORM method to get a product ID by product_code
//     const productId = await Product.getIdByProductCode(product_code);
//     return productId;
//   },

//   updateProduct: async (product_code, productData) => {
//     // Use the ORM method to update the product
//     const updatedProduct = await Product.updateProduct(product_code, productData);
//     return updatedProduct;
//   },

//   deleteProduct: async (product_code) => {
//     // Use the ORM method to delete the product
//     const deletedCount = await Product.deleteProduct(product_code);
//     return deletedCount;
//   },
// };

// module.exports = ProductService;



// second option
// const db = require('../db/database');
// const Product = require('../models/ProductModel');

// const ProductService = {
//   createProduct: async (productData) => {
//     return db.tx(async t => {
//       const newProduct = await Product.create(productData, t);
//       return newProduct;
//     });
//   },

//   getAllProducts: async () => {
//     return Product.findAll();
//   },

//   getProductByProductCode: async (product_code) => {
//     return Product.findByProductCode(product_code);
//   },

//   getProductBySupplierId: async (supplier_id) => {
//     return Product.findBySupplierId(supplier_id);
//   },
//   getIdByProductCode: async (product_code) => {
//     return Product.getIdByProductCode(product_code);
//   },
//   updateProduct: async (product_code, productData) => {
//     return db.tx(async t => {
//       const updatedProduct = await Product.update(product_code, productData, t);
//       return updatedProduct;
//     });
//   },

//   deleteProduct: async (product_code) => {
//     return db.tx(async t => {
//       const deletedCount = await Product.delete(product_code, t);
//       return deletedCount;
//     });
//   },
// };

// module.exports = ProductService;



// const Product = require('../models/ProductModel');
// // console.log("5")
// const ProductService = {
//   createProduct: async (productData) => {
//     return Product.create(productData);
//   },
//   getAllProducts: async () => {
//     return Product.findAll();
//   },
//   getProductById: async (id) => {
//     return Product.findById(id);
//   },
//   updateProduct: async (id, productData) => {
//     return Product.update(id, productData);
//   },
//   deleteProduct: async (id) => {
//     return Product.delete(id);
//   },
// };

// module.exports = ProductService;


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