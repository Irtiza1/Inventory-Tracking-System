const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Product = require('./ProductModel');
const Store = require('./StoreModel');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movement_type: {
    type: DataTypes.ENUM('stock-in', 'sale', 'manual-removal'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'stockmovement',
  timestamps: false
});

StockMovement.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
StockMovement.belongsTo(Store, { foreignKey: 'store_id', onDelete: 'CASCADE' });

StockMovement.recordMovement = async (product_id, movement) => {
  try {
    const newMovement = await StockMovement.create({
      product_id: product_id,
      store_id: movement.store_id,
      movement_type: movement.movement_type,
      quantity: movement.quantity
    });
    return newMovement;
  } catch (error) {
    throw new Error('Error recording stock movement: ' + error.message);
  }
};

StockMovement.getAllStockMovements = async () => {
  try {
    const movements = await StockMovement.findAll();
    return movements;
  } catch (error) {
    throw new Error('Error retrieving stock movements: ' + error.message);
  }
};

StockMovement.findById = async (id) => {
  try {
    const movement = await StockMovement.findOne({
      where: { id: id }
    });
    return movement;
  } catch (error) {
    throw new Error('Error retrieving stock movement by ID: ' + error.message);
  }
};

StockMovement.findByStoreId = async (store_id) => {
  try {
    const movements = await StockMovement.findAll({
      where: { store_id: store_id },
      order: [['timestamp', 'DESC']],
    });
    return movements;
  } catch (error) {
    throw new Error('Error retrieving stock movements by store ID: ' + error.message);
  }
};

StockMovement.deleteStock = async (id) => {
  try {
    const result = await StockMovement.destroy({
      where: { id: id },
    });
    return result;
  } catch (error) {
    throw new Error('Error deleting stock movement: ' + error.message);
  }
};

module.exports = StockMovement;
