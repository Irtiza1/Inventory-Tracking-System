const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:productCode", ProductController.getById);
router.get("/:productCode/stock", ProductController.getCurrentStock);
router.patch("/:productCode/:operation", ProductController.updateStock); //{operation: "stock-in" , "manual-remove", "sale"}

router.delete("/:productCode", ProductController.deleteProduct);

module.exports = router;