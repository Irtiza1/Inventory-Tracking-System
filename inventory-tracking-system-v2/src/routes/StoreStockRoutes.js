const express = require('express');
const router = express.Router();
const StoreStockController = require('../controllers/StoreStockController');
const { authenticate, authorize } = require('../middleware/AuthMiddleware');

router.get('/',  StoreStockController.getAllStock);
router.get('/:storeId/:product_code', StoreStockController.getStock);
router.put('/:storeId/:product_code', StoreStockController.updateStock);
router.post('/', StoreStockController.createStock);
router.post('/', StoreStockController.stockAdjustment);
router.delete('/:storeId/:product_code', StoreStockController.deleteStoreStock);
module.exports = router;
