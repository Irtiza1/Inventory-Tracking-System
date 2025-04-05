const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/StockMovementController');

router.post('/', StockMovementController.createStockMovement);
router.get('/', StockMovementController.getAllStockMovements);
router.get('/:id', StockMovementController.getStockMovementById);
router.put('/:id', StockMovementController.updateStockMovement);
router.delete('/:id', StockMovementController.deleteStockMovement);

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const InventoryMovementController = require("../controllers/InventoryMovementController");

// router.post("/", InventoryMovementController.recordMovement);
// router.get("/:productId", InventoryMovementController.getMovements);

// module.exports = router;
