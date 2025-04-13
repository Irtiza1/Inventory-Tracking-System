const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');
const redis = require('../db/redis');
const Product = require('./ProductModel');
const Store = require('./StoreModel');
const StockMovement = writeSequelize.define('StockMovement', {
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
    type: DataTypes.ENUM('stock-in', 'sale', 'manual-removal', 'transfer', 'adjustment'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  deletedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'stock_movements',
  timestamps: false,
  paranoid: true,
  indexes: [
    { fields: ['product_id'] },
    { fields: ['store_id'] },
    { fields: ['timestamp'] }
  ],
  hooks: {
    afterCreate: async (movement, options) => {
      await redis.set(`movement:${movement.id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
      await redis.del('movements:all');
    },
    afterUpdate: async (movement, options) => {
      await redis.set(`movement:${movement.id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
      await redis.del('movements:all');
    },
    afterDestroy: async (movement, options) => {
      await redis.del(`movement:${movement.id}`);
      await redis.del('movements:all');
    }
  }
});

// Associations
StockMovement.associate = (models) => {
  StockMovement.belongsTo(Product, { 
    foreignKey: 'product_id', 
    as: 'product',
    onDelete: 'CASCADE' 
  });
  
  StockMovement.belongsTo(Store, { 
    foreignKey: 'store_id', 
    as: 'store',
    onDelete: 'CASCADE' 
  });
};

// Class Methods
StockMovement.recordMovement = async (productId, movementData, userId, options = {}) => {
  try {
    options.userId = userId;
    const movement = await StockMovement.create({
      product_id: productId,
      store_id: movementData.store_id,
      movement_type: movementData.movement_type,
      quantity: movementData.quantity,
      createdBy: userId,
      updatedBy: userId
    }, options);
    
    return movement;
  } catch (error) {
    throw new Error('Error recording stock movement: ' + error.message);
  }
};

StockMovement.getAllStockMovements = async (options = {}) => {
  try {
    // Try cache first
    const cached = await redis.get('movements:all');
    if (cached) return JSON.parse(cached);

    const movements = await StockMovement.findAll({
      include: [
        { association: 'product', attributes: ['id', 'name', 'product_code'] },
        { association: 'store', attributes: ['id', 'name'] }
      ],
      order: [['timestamp', 'DESC']],
      ...options
    });
    
    // Cache result
    if (movements.length > 0) {
      await redis.set('movements:all', JSON.stringify(movements), 'EX', 300);
    }
    
    return movements;
  } catch (error) {
    throw new Error('Error retrieving stock movements: ' + error.message);
  }
};

StockMovement.findById = async (id, options = {}) => {
  try {
    // Try cache first
    const cached = await redis.get(`movement:${id}`);
    if (cached) return JSON.parse(cached);

    const movement = await StockMovement.findOne({
      where: { id },
      include: [
        { association: 'product', attributes: ['id', 'name'] },
        { association: 'store', attributes: ['id', 'name'] }
      ],
      ...options
    });

    if (movement) {
      await redis.set(`movement:${id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
    }
    
    return movement;
  } catch (error) {
    throw new Error('Error retrieving stock movement by ID: ' + error.message);
  }
};

StockMovement.findByStoreId = async (storeId, options = {}) => {
  try {
    const cacheKey = `movements:store:${storeId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const movements = await StockMovement.findAll({
      where: { store_id: storeId },
      include: [
        { association: 'product', attributes: ['id', 'name', 'product_code'] }
      ],
      order: [['timestamp', 'DESC']],
      ...options
    });

    if (movements.length > 0) {
      await redis.set(cacheKey, JSON.stringify(movements), 'EX', 300);
    }
    
    return movements;
  } catch (error) {
    throw new Error('Error retrieving stock movements by store ID: ' + error.message);
  }
};

StockMovement.deleteStock = async (id, userId, options = {}) => {
  try {
    options.userId = userId;
    
    // Soft delete first to trigger hooks
    await StockMovement.update(
      { deletedBy: userId },
      { where: { id }, ...options }
    );
    
    const result = await StockMovement.destroy({
      where: { id },
      ...options
    });
    
    return result;
  } catch (error) {
    throw new Error('Error deleting stock movement: ' + error.message);
  }
};

module.exports = StockMovement;

// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../db/database');
// const Product = require('./ProductModel');
// const Store = require('./StoreModel');

// const StockMovement = sequelize.define('StockMovement', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   product_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   store_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   movement_type: {
//     type: DataTypes.ENUM('stock-in', 'sale', 'manual-removal'),
//     allowNull: false
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   timestamp: {
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.NOW
//   },
//   createdBy: DataTypes.INTEGER,
//   updatedBy: DataTypes.INTEGER,
//   deletedBy: DataTypes.INTEGER,

// }, {
//   tableName: 'stockmovement',
//   timestamps: false,
//   paranoid: true
// });

// StockMovement.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
// StockMovement.belongsTo(Store, { foreignKey: 'store_id', onDelete: 'CASCADE' });

// StockMovement.recordMovement = async (product_id, movement,userId) => {
//   try {
//     const newMovement = await StockMovement.create({
//       product_id: product_id,
//       store_id: movement.store_id,
//       movement_type: movement.movement_type,
//       quantity: movement.quantity,
//       updatedBy: userId

//     });
//     return newMovement;
//   } catch (error) {
//     throw new Error('Error recording stock movement: ' + error.message);
//   }
// };

// StockMovement.getAllStockMovements = async () => {
//   try {
//     const movements = await StockMovement.findAll();
//     return movements;
//   } catch (error) {
//     throw new Error('Error retrieving stock movements: ' + error.message);
//   }
// };

// StockMovement.findById = async (id) => {
//   try {
//     const movement = await StockMovement.findOne({
//       where: { id: id }
//     });
//     return movement;
//   } catch (error) {
//     throw new Error('Error retrieving stock movement by ID: ' + error.message);
//   }
// };

// StockMovement.findByStoreId = async (store_id) => {
//   try {
//     const movements = await StockMovement.findAll({
//       where: { store_id: store_id },
//       order: [['timestamp', 'DESC']],
//     });
//     return movements;
//   } catch (error) {
//     throw new Error('Error retrieving stock movements by store ID: ' + error.message);
//   }
// };

// StockMovement.deleteStock = async (id,userId) => {
//   try {
//     const result = await StockMovement.destroy({
//       where: { id: id , deletedBy: userId},
//     });
//     return result;
//   } catch (error) {
//     throw new Error('Error deleting stock movement: ' + error.message);
//   }
// };

// module.exports = StockMovement;
