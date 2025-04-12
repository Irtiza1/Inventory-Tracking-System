const ProductService = require('../services/ProductService');
const { validateProduct } = require('../validations/ProductValidation');

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
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  },

  getProductByProductCode: async (req, res) => {
    const productCode = req.params.product_code;
    if (!productCode) {
      return res.status(400).json({ error: 'Product code is required' });
    }

    try {
      const product = await ProductService.getProductByProductCode(productCode);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  },  

  getProductBySupplierId: async (req, res) => {
    const supplierId = req.params.supplier_id;
    if (!supplierId) {
      return res.status(400).json({ error: 'Supplier ID is required' });
    }

    try {
      const product = await ProductService.getProductBySupplierId(supplierId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  },
  getIdByProductCode: async (req, res) => {
    const productCode = req.params.product_code;
    if (!productCode) {
      return res.status(400).json({ error: 'Product code is required' });
    }

    try {
      const product = await ProductService.getIdByProductCode(productCode);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve product Id' });
    }
  },
  updateProduct: async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const product = await ProductService.updateProduct(req.params.product_code, req.body);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await ProductService.deleteProduct(req.params.product_code);
      if (product === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
};

module.exports = ProductController;

