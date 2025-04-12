const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/StockMovementController');

router.post('/', StockMovementController.recordStockMovement);
router.get('/', StockMovementController.getAllStockMovements);
router.get('/:product_code', StockMovementController.getStockMovementByProductCode);
router.get('/:store_id', StockMovementController.getStockMovementByStoreId);
router.delete('/:product_code', StockMovementController.deleteStockMovement);

module.exports = router;

