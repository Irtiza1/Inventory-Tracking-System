const { writeSequelize, readSequelize } = require('./database');
const { addAuditHooks, initializeAuditLogger } = require('../utils/auditLogger');
const AuditLog = require('../models/AuditLogModel');
const StockMovement = require('../models/StockMovementModel');

const models = {
  ProductModel: require('../models/ProductModel'),
  StockMovementModel: require('../models/StockMovementModel'),
  StoreModel: require('../models/StoreModel'),
  StoreStockModel: require('../models/StoreStockModel'),
  UserAccountModel: require('../models/UserModel'),
  Supplier: require('../models/SupplierModel'),
  AuditLog: AuditLog
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

initializeAuditLogger(AuditLog);
addAuditHooks(writeSequelize, (options) => options?.userId);

module.exports = {
  sequelize: writeSequelize,
  readSequelize,
  ...models
};