const InventoryMovementModel = require("../models/InventoryMovementModel");

const InventoryMovementController = {
  // Record movement
  recordMovement: async (req, res) => {
    try {
      const { productId, movementType, quantity } = req.body;
      
      // Basic validation
      if (!productId || !movementType || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await InventoryMovementModel.recordMovement(productId, movementType, quantity);
      res.json({ message: "Movement recorded" });
    } catch (err) {
      res.status(500).json({ error: "Failed to record movement" });
    }
  },

  // Get movements
  getMovements: async (req, res) => {
    try {
      const { data } = await InventoryMovementModel.getMovements(req.params.productId);
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch movements" });
    }
  }
};

module.exports = InventoryMovementController;
// const InventoryMovementModel = require("../models/InventoryMovementModel");

// const InventoryMovementController = {
//   // Record movement
//   recordMovement: async (req, res) => {
//     try {
//       const { productId, movementType, quantity } = req.body;
      
//       if (!productId || !movementType || !quantity) {
//         return res.status(400).json({ error: "Missing fields" });
//       }

//       await InventoryMovementModel.recordMovement(productId, movementType, quantity);
//       res.json({ message: "Movement recorded" });
//     } catch (err) {
//       res.status(500).json({ error: "Failed to record movement" });
//     }
//   },

//   // Get movements
//   getMovements: async (req, res) => {
//     try {
//       const movements = await InventoryMovementModel.getMovements(req.params.productId);
//       res.json(movements);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch movements" });
//     }
//   }
// };

// module.exports = InventoryMovementController;

// // controllers/InventoryMovementController.js
// const Joi = require('joi');
// const InventoryMovementService = require("../services/InventoryMovementService");

// // Define Joi validation schemas
// const movementRecordSchema = Joi.object({
//     productId: Joi.number().integer().required().messages({
//         'number.base': 'Product ID must be a number',
//         'any.required': 'Product ID is required'
//     }),
//     movementType: Joi.string().trim().required().messages({
//         'string.empty': 'Movement type is required',
//         'any.required': 'Movement type is required'
//     }),
//     quantity: Joi.number().integer().required().messages({
//         'number.base': 'Quantity must be a number',
//         'any.required': 'Quantity is required'
//     })
// });

// const InventoryMovementController = {
//     // Record a new inventory movement
//     recordMovement: async (req, res) => {
//         try {
//             // Validate request body
//             const { error, value } = movementRecordSchema.validate(req.body, { 
//                 abortEarly: false 
//             });
            
//             if (error) {
//                 const errors = error.details.map(detail => ({
//                     field: detail.path[0],
//                     message: detail.message
//                 }));
//                 return res.status(400).json({ errors });
//             }

//             const { productId, movementType, quantity } = value;
//             const result = await InventoryMovementService.recordMovement(productId, movementType, quantity);
//             res.json({ message: "Inventory movement recorded", ...result });
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     },

//     // Get all movements for a product
//     getMovements: async (req, res) => {
//         try {
//             const { productId } = req.params;
//             const movements = await InventoryMovementService.getMovements(productId);
//             res.json(movements);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     }
// };

// module.exports = InventoryMovementController;



// const InventoryMovementModel = require("../models/InventoryMovementModel");
// const { body, validationResult } = require("express-validator");

// const InventoryMovementController = {
//     // Record a new inventory movement
//     recordMovement: [
//         body("productId").isInt(),
//         body("movementType").isString().trim().notEmpty(),
//         body("quantity").isInt(),

//         (req, res) => {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ errors: errors.array() });
//             }

//             const { productId, movementType, quantity } = req.body;
//             InventoryMovementModel.recordMovement(productId, movementType, quantity, (err, movementId) => {
//                 if (err) return res.status(500).json({ error: "Database error" });
//                 res.json({ message: "Inventory movement recorded", movementId });
//             });
//         }
//     ],

//     // Get all movements for a product
//     getMovements: (req, res) => {
//         const { productId } = req.params;
//         InventoryMovementModel.getMovements(productId, (err, movements) => {
//             if (err) return res.status(500).json({ error: "Database error" });
//             res.json(movements);
//         });
//     }
// };

// module.exports = InventoryMovementController;
