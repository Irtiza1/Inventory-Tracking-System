const express = require('express');
const dotenv = require('dotenv');  
dotenv.config();

const PORT = process.env.PORT || 3000;
const ProductRoutes = require("./routes/ProductRoutes");
const InventoryMovementRoutes = require("./routes/InventoryMovementRoute")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

app.use("/products", ProductRoutes);
app.use("/movements", InventoryMovementRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Kirana Store API running on port ${PORT}`);
});
