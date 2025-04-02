const express = require('express');
const dotenv = require('dotenv');  
dotenv.config();

const PORT = process.env.PORT || 3000;
const ProductRoutes = require("./routes/ProductRoutes");
const InventoryMovementRoutes = require("./routes/InventoryMovementRoute")
const app = express();

// ---------- Middleware (Minimal for Stage 1) ----------
app.use(express.json()); // Only needed middleware for JSON APIs
app.use(express.urlencoded({ extended: false })); // Simpler than `true`

// ---------- Routes ----------
app.use("/products", ProductRoutes);
app.use("/movements", InventoryMovementRoutes);

// ---------- Error Handling (Simplified) ----------
app.use((err, req, res, next) => {
  console.error(err); // Log the error
  res.status(500).json({ error: "Internal server error" });
});

// ---------- Server Startup ----------
app.listen(PORT, () => {
  console.log(`Kirana Store API running on port ${PORT}`);
});

// For testing (if needed)
// module.exports = app;