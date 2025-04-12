const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const db = require('./db/database');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const { authenticate, authorize } = require('./middleware/AuthMiddleware');

// Routes
const ProductRoutes = require('./routes/ProductRoutes');
const StockMovementRoutes = require('./routes/StockMovementRoutes');
const StoreRoutes = require('./routes/StoreRoutes');
const SupplierRoutes = require('./routes/SupplierRoutes');
const UserRoutes = require('./routes/UserRoutes');
const StoreStockRoutes = require('./routes/StoreStockRoutes');
const AuthController = require('./controllers/AuthController');
const ReportRoutes = require('./routes/ReportRoutes');
// Rate Limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(rateLimiter);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- PUBLIC ROUTE ----------
app.post('/login', AuthController.login); // No authentication required

// ---------- AUTHENTICATED ROUTES ----------
app.use(authenticate);

// Role-based routing
app.use('/products', authorize(['admin', 'store-manager']), ProductRoutes);
app.use('/stock', authorize(['admin', 'store-manager']), StockMovementRoutes);
app.use('/stores', authorize(['admin', 'store-manager']), StoreRoutes);
app.use('/suppliers', authorize(['admin', 'supplier']), SupplierRoutes);
app.use('/users', authorize(['admin']), UserRoutes);
app.use('/store-stock', authorize(['admin', 'store-manager', 'analytics']), StoreStockRoutes);
app.use('/report',authorize(['analytics']),ReportRoutes)
// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting server: ${err.message}`);
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
