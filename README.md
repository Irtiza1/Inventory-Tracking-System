# Inventory-Tracking-System
inventory-tracking-system-v2/
├── .env
├── package.json
├── package-lock.json
├── node_modules/                        # Node.js dependencies
├── src/
│   ├── server.js                        # Application entry point
│
│   ├── controllers/                     # Route handlers / Business logic
│   │   ├── AuthController.js
│   │   ├── ProductController.js
│   │   ├── ProductSupplierController.js
│   │   ├── ReportController.js
│   │   ├── StockMovementController.js
│   │   ├── StoreController.js
│   │   ├── StoreStockController.js
│   │   ├── SupplierController.js
│   │   └── UserController.js
│
│   ├── db/                              # Database connection
│   │   └── database.js
│
│   ├── middleware/                      # Express middlewares
│   │   ├── AuthMiddleware.js
│   │   └── RateLimiterMiddleware.js
│
│   ├── models/                          # Sequelize models
│   │   ├── index.js
│   │   ├── ProductModel.js
│   │   ├── StockMovementModel.js
│   │   ├── StoreModel.js
│   │   ├── StoreStockModel.js
│   │   ├── SupplierModel.js
│   │   └── UserModel.js
│
│   ├── routes/                          # API route definitions
│   │   ├── ProductRoutes.js
│   │   ├── ReportRoutes.js
│   │   ├── StockMovementRoutes.js
│   │   ├── StoreRoutes.js
│   │   ├── StoreStockRoutes.js
│   │   ├── SupplierRoutes.js
│   │   └── UserRoutes.js
│
│   ├── services/                        # Service layer for business logic
│   │   ├── ProductService.js
│   │   ├── ProductSupplierService.js
│   │   ├── ReportService.js
│   │   ├── StockMovementService.js
│   │   ├── StoreService.js
│   │   ├── StoreStockService.js
│   │   ├── SupplierService.js
│   │   └── UserService.js
│
│   ├── validations/                     # Request validation logic
│   │   ├── ProductValidation.js
│   │   ├── StockMovementValidation.js
│   │   ├── StoreStockValidation.js
│   │   ├── StoreValidation.js
│   │   ├── SupplierValidation.js
│   │   ├── UserValidation.js
│   │   └── ValidateDateRange.js
