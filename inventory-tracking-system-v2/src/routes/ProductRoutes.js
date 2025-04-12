const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const ProductSupplierController = require('../controllers/ProductSupplierController');
// Routes for product management
// console.log("2")
router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:product_code', ProductController.getIdByProductCode);
router.get('/:product_code', ProductController.getProductByProductCode);
router.get('/:supplier_id', ProductController.getProductBySupplierId);
router.put('/:product_code', ProductController.updateProduct);
router.delete('/:product_code', ProductController.deleteProduct);
router.get('/allproductsupplier', ProductSupplierController.viewProductSupplierList);
module.exports = router;



// const express = require("express");
// const router = express.Router();
// const ProductController = require("../controllers/ProductController");

// router.post("/", ProductController.create);
// router.get("/", ProductController.getAll);
// router.get("/:id", ProductController.getById);
// router.put("/:productId/stock", ProductController.updateStock);
// router.get("/:productId/stock", ProductController.getCurrentStock);

// module.exports = router;
