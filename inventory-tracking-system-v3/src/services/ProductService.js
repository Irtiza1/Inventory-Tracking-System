
const Product = require('../models/ProductModel');

const ProductService = {
  createProduct: async (productData) => {
    const userId = req.user.id; 
    try {
      const newProduct = await Product.createProduct({ ...productData, user_id: userId });
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
    const userId = req.user.id; 
    try {
      const updatedProduct = await Product.updateProduct(product_code, { ...productData, user_id: userId });
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product with code "${product_code}":`, error);
      throw new Error('Failed to update product');
    }
  },

  deleteProduct: async (product_code) => {
    const userId = req.user.id; 
    try {
      const deletedCount = await Product.deleteProduct(product_code,userId);
      return deletedCount;
    } catch (error) {
      console.error(`Error deleting product with code "${product_code}":`, error);
      throw new Error('Failed to delete product');
    }
  },
};

module.exports = ProductService;

