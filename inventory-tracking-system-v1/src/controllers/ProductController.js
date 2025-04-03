const ProductModel = require("../models/ProductModel");
const InventoryMovementModel = require("../models/InventoryMovementModel");
const ProductController = {
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

  getAll: async (req, res) => {
    try {
      const { data } = await ProductModel.getAll();
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  },

  getById: async (req, res) => {
    try {
      const {productCode} = req.params
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

  updateStock: async (req, res) => {
      try {
          const { productCode,operation } = req.params;
          const { quantity } = req.body; 
          if (!productCode) {
            return res.status(400).json({ error: "Invalid product code" });
          }
          if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
              return res.status(400).json({ error: "Quantity must be a positive integer" });
          }

          const product = await ProductModel.getById(productCode);
          if (!product) {
              return res.status(404).json({ error: "Product not found" });
          }

          if (operation === 'stock-in') {
            await ProductModel.updateStock(productCode, quantity);
            
            await InventoryMovementModel.recordMovement(productCode,"stock-in",quantity);
          }
          else if (operation === 'sale') {
            await ProductModel.updateStock(productCode, -quantity);

            await InventoryMovementModel.recordMovement(productCode, "sale",quantity);
          }
          else if (operation === 'manual-removal') {
            await ProductModel.updateStock(productCode, -quantity);
            await InventoryMovementModel.recordMovement(productCode,"manual-removal", quantity);
          }
          else {
            return res.status(400).json({ error: "Invalid operation" });
          }

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
  getCurrentStock: async (req, res) => {
    try {
      const {productCode} = req.params
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

  deleteProduct: async (req, res) => {
    try {
      
      const {productCode} = req.params
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
