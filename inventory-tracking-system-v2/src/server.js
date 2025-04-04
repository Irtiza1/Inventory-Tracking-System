const express = require('express');  
const cookieParser = require('cookie-parser'); // Fixed here  
const cors = require('cors');  
const dotenv = require('dotenv');  

dotenv.config();  

const PORT = process.env.PORT || 3000;  
const ProductRoutes = require("./routes/ProductRoutes");  
const InventoryMovementRoutes = require("./routes/InventoryMovementRoutes");  
const app = express();  

// Middleware setup  
app.use(cors()); // If needed for cross-origin requests  
app.use(cookieParser());  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

app.use("/product", ProductRoutes);  
app.use("/inventory", InventoryMovementRoutes);  

// Centralized error handling middleware  
app.use((err, req, res, next) => {  
  console.error(err.stack);  
  res.status(500).send({ error: 'Something went wrong!' });  
});  

app.listen(PORT, (err) => {  
  if (err) {  
    console.error(`Error occurred while starting the server: ${err.message}`);  
  } else {  
    console.log(`Server is running on port ${PORT}`);  
  }  
});  

// export { app };  