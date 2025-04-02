// routes.js
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

// Products
router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.get("/:id/stock", ProductController.getCurrentStock);
router.patch("/:id/stock", ProductController.updateStock);


module.exports = router;