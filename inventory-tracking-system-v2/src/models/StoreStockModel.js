const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Store = require('../models/StoreModel');
const Product = require('../models/ProductModel');

const StoreStock = sequelize.define('StoreStock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store,
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'storestock',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['store_id', 'product_id'], 
    },
  ],
});

StoreStock.belongsTo(Store, { foreignKey: 'store_id' });
StoreStock.belongsTo(Product, { foreignKey: 'product_id' });


StoreStock.createStoreStock = async (productId, stockData) => {
  return StoreStock.create({
    store_id: stockData.store_id,
    product_id: productId,
    quantity: stockData.quantity,
  });
};

StoreStock.findAllStoreStocks = async () => {
  return StoreStock.findAll();
};

StoreStock.findByStoreAndProduct = async (storeId, productId) => {
  return StoreStock.findOne({
    where: {
      store_id: storeId,
      product_id: productId,
    },
  });
};

StoreStock.updateQuantity = async (storeId, productId, quantity) => {
  const updatedStock = await StoreStock.update(
    { quantity, updated_at: Sequelize.NOW },
    {
      where: {
        store_id: storeId,
        product_id: productId,
      },
      returning: true,
    }
  );
  return updatedStock[1][0];
};

StoreStock.StockAdjustment = async (productId, movement) => {
  const quantity = movement.quantity;
  let updatedQuantity;

  const storeStock = await StoreStock.findOne({
    where: {
      store_id: movement.store_id,
      product_id: productId,
    },
  });

  if (!storeStock) {
    throw new Error('StoreStock not found');
  }

  if (movement.movement_type === 'stock-in') {
    updatedQuantity = storeStock.quantity + quantity;
  } else if (movement.movement_type === 'sale' || movement.movement_type === 'manual-removal') {
    updatedQuantity = storeStock.quantity - quantity;
  } else {
    throw new Error("Invalid movement type");
  }

  const updatedStock = await StoreStock.update(
    { quantity: updatedQuantity, updated_at: Sequelize.NOW },
    {
      where: {
        store_id: movement.store_id,
        product_id: productId,
      },
      returning: true,
    }
  );
  return updatedStock[1][0]; 
};

StoreStock.deleteStoreStock = async (storeId, productId) => {
  const deletedCount = await StoreStock.destroy({
    where: {
      store_id: storeId,
      product_id: productId,
    },
  });
  return deletedCount; 
};
module.exports = StoreStock;
