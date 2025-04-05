const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const db = require('./db/database'); 
dotenv.config();

const PORT = process.env.PORT || 3000;
const ProductRoutes = require("./routes/ProductRoutes");
const StockMovementRoutes = require("./routes/StockMovementRoutes");
const StoreRoutes = require("./routes/StoreRoutes");
const SupplierRoutes = require("./routes/SupplierRoutes");
const UserRoutes = require("./routes/UserRoutes");

const app = express();

// Rate Limiting Middleware (e.g., 100 requests per 15 minutes per IP)
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per IP
  message: 'Too many requests from this IP, please try again later.',
});

app.use(rateLimiter);

// Middleware setup
app.use(cors()); // If needed for cross-origin requests
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// console.log("1")
app.use("/products", ProductRoutes);
app.use("/stock", StockMovementRoutes);
app.use("/stores", StoreRoutes);
app.use("/suppliers", SupplierRoutes);
app.use("/users", UserRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error occurred while starting the server: ${err.message}`);
  } else {
    console.log(`🚀 Server is running on port ${PORT}`);
  }
});

// module.exports = app;


// const express = require('express');  
// const cookieParser = require('cookie-parser'); // Fixed here  
// const cors = require('cors');  
// const dotenv = require('dotenv');  

// dotenv.config();  

// const PORT = process.env.PORT || 3000;  
// // const ProductRoutes = require("./routes/ProductRoutes");  
// // const InventoryMovementRoutes = require("./routes/InventoryMovementRoutes");  
// const app = express();  

// // Middleware setup  
// app.use(cors()); // If needed for cross-origin requests  
// app.use(cookieParser());  
// app.use(express.json());  
// app.use(express.urlencoded({ extended: true }));  

// // app.use("/product", ProductRoutes);  
// // app.use("/inventory", InventoryMovementRoutes);  

// // Centralized error handling middleware  
// app.use((err, req, res, next) => {  
//   console.error(err.stack);  
//   res.status(500).send({ error: 'Something went wrong!' });  
// });  

// app.listen(PORT, (err) => {  
//   if (err) {  
//     console.error(`Error occurred while starting the server: ${err.message}`);  
//   } else {  
//     console.log(`Server is running on port ${PORT}`);  
//   }  
// });  

// // export { app };  