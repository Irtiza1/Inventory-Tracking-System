const { writeSequelize, readSequelize } = require('./database');
const { addAuditHooks, initializeAuditLogger } = require('../utils/auditLogger');
const AuditLog = require('../models/AuditLogModel');
const StockMovement = require('../models/StockMovementModel');

// Import all models
const models = {
  ProductModel: require('../models/ProductModel'),
  StockMovementModel: require('../models/StockMovementModel'),
  StoreModel: require('../models/StoreModel'),
  StoreStockModel: require('../models/StoreStockModel'),
  UserAccountModel: require('../models/UserModel'),
  Supplier: require('../models/SupplierModel'),
  AuditLog: AuditLog
};

// Initialize models
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Initialize audit logger AFTER all models are loaded
initializeAuditLogger(AuditLog);
addAuditHooks(writeSequelize, (options) => options?.userId);

module.exports = {
  sequelize: writeSequelize,
  readSequelize,
  ...models
};
// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const db = {};

// // Import sequelize instance from your custom DB connection file
// const sequelize = require('../db/database'); // Make sure this exports a Sequelize instance

// // Load all model files in this directory (except index.js and database.js)
// fs.readdirSync(__dirname)
//   .filter(file =>
//     file.endsWith('.js') &&
//     file !== 'index.js' &&
//     file !== 'database.js' // Ignore database.js
//   )
//   .forEach(file => {
//     const modelPath = path.join(__dirname, file);
//     const modelFunc = require(modelPath);

//     if (typeof modelFunc === 'function') {
//       const model = modelFunc(sequelize, Sequelize.DataTypes);
//       db[model.name] = model;
//     } else {
//       console.warn(`⚠️  Skipped loading model from ${file} — expected a function.`);
//     }
//   });

// // Run associations if defined in model
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Apply audit hooks if needed
// const { addAuditHooks } = require('../utils/auditLogger');
// addAuditHooks(sequelize, (options) => {
//   return options?.user?.id || null;
// });

// // Export sequelize and all models
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;


// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const db = {};

// // Import sequelize instance from your custom DB connection file
// const sequelize = require('../db/database'); // make sure this exports a Sequelize instance

// // Load all model files in this directory (except index.js)
// fs.readdirSync(__dirname)
//   .filter(file => file.endsWith('.js') && file !== 'index.js')
//   .forEach(file => {
//     const modelPath = path.join(__dirname, file);
//     const modelFunc = require(modelPath);

//     if (typeof modelFunc === 'function') {
//       const model = modelFunc(sequelize, Sequelize.DataTypes);
//       db[model.name] = model;
//     } else {
//       console.warn(`⚠️  Skipped loading model from ${file} — expected a function.`);
//     }
//   });

// // Run associations if defined in model
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Apply audit hooks if needed
// const { addAuditHooks } = require('../utils/auditLogger');
// addAuditHooks(sequelize, (options) => {
//   return options?.user?.id || null;
// });

// // Export sequelize and all models
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;


// // models/index.js or wherever you init Sequelize

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// // const config = require(__dirname + '/../config/config.json')['development'];
// const db = {};
// const sequelize = require('../db/database');
// // const sequelize = new Sequelize(config.database, config.username, config.password, config);

// // Load all models
// fs.readdirSync(__dirname)
//   .filter(file => file.endsWith('.js') && file !== 'index.js')
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// // Run associations if any
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Load and apply audit hook
// const { addAuditHooks } = require('../utils/auditLogger');

// // You define how to get the current user from options (e.g., from middleware)
// addAuditHooks(sequelize, (options) => {
//   return options?.user?.id || null;
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;


// const Product = require('../models/ProductModel');
// const StockMovement = require('../models/StockMovementModel');
// const Store = require('../models/StoreModel');
// const Supplier = require('../models/SupplierModel');
// const UserAccount = require('../models/UserModel');
// const StoreStock = require('../models/StoreStockModel');
// const AuditLog = require('../models/AuditLogModel'); 
// module.exports = {
//   Product,
//   StockMovement,
//   Store,
//   Supplier,
//   UserAccount,
//   StoreStock,
//   AuditLog, 
// };
