const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');

router.get('/inventory/:storeId', reportController.getStoreInventoryReport);
router.get('/sales/:storeId', reportController.getSalesReport);

module.exports = router;
