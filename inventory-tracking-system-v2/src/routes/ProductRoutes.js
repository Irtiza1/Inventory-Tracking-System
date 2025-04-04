const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Routes for product management
router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

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
