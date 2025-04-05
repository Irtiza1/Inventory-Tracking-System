const express = require('express');
const router = express.Router();
const StoreStockController = require('../controllers/StoreStockController');
const { authenticate, authorize } = require('../middleware/AuthMiddleware');

// Admin & store-manager access (example)
router.get('/', authenticate, authorize(['admin', 'store-manager']), StoreStockController.getAllStock);
router.get('/:storeId/:productId', authenticate, authorize(['admin', 'store-manager']), StoreStockController.getStock);
router.put('/:storeId/:productId', authenticate, authorize(['admin', 'store-manager']), StoreStockController.updateStock);
router.post('/', authenticate, authorize(['admin']), StoreStockController.createStock);

module.exports = router;
