// routes.js
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

// Products
router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:productCode", ProductController.getById);
router.get("/:productCode/stock", ProductController.getCurrentStock);
// router.patch("/:id/stock", ProductController.addStock);
// router.patch("/:id/product", ProductController.saleProduct);
// router.patch("/:id/product", ProductController.removeProduct);
router.patch("/:productCode/:operation", ProductController.updateStock); //{operation: "stock-in" , "manual-remove", "sale"}

router.delete("/:productCode", ProductController.deleteProduct);

// 1- search product by name or product_code
module.exports = router;