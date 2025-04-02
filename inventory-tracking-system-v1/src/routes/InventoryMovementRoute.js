// routes.js
const express = require("express");
const router = express.Router();
const InventoryMovementController = require("../controllers/InventoryMovementController");


// Inventory Movements
router.post("/", InventoryMovementController.recordMovement);
router.get("/:productId", InventoryMovementController.getMovements);

module.exports = router;