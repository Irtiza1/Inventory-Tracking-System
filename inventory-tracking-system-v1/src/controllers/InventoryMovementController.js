const InventoryMovementModel = require("../models/InventoryMovementModel");
const ProductModel = require("../models/ProductModel");
const InventoryMovementController = {
  recordMovement: async ({ productCode, movementType, quantity })=> {
    try {
      const productId = await ProductModel.getIdByCode(productCode);

      if (!productId || !operation || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await InventoryMovementModel.recordMovement(productId, operation, quantity);
      res.json({ message: "Movement recorded" });
    } catch (err) {
      res.status(500).json({ error: "Failed to record movement" });
    }
  },

  getMovements: async (req, res) => {
    try {
        const { productCode } = req.params; 

        if (!productCode) {
            return res.status(400).json({ error: "Invalid product code" });
        }

        const movements = await InventoryMovementModel.getMovements(productCode); 
        res.json(movements || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch movements" });
    }
  }

};

module.exports = InventoryMovementController;
