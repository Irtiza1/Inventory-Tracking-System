const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');
const redis = require('../db/redis');
const Product = require('./ProductModel');
const Store = require('./StoreModel');

// Helper function to emit stock updates
async function emitStockUpdate(storeId, productId, newQuantity) {
  try {
    const app = require('../server'); // Get app instance
    const io = app.get('socketio');
    
    // Debounce rapid updates
    const debounceKey = `stock:debounce:${storeId}:${productId}`;
    const lastEmitted = await redis.get(debounceKey);
    
    if (!lastEmitted || Date.now() - lastEmitted > 1000) { // 1 second debounce
      await redis.set(debounceKey, Date.now(), 'PX', 1000);
      
      io.to(`store:${storeId}:product:${productId}`).emit('stock-change', {
        storeId,
        productId,
        newQuantity,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Emitted stock update for product ${productId} in store ${storeId}`);
    }
  } catch (error) {
    console.error('Error emitting stock update:', error);
  }
}

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
      await emitStockUpdate(movement.store_id, movement.product_id, movement.quantity);
    },
    afterUpdate: async (movement, options) => {
      await redis.set(`movement:${movement.id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
      await redis.del('movements:all');
      if (movement.changed('quantity')) {
        await emitStockUpdate(movement.store_id, movement.product_id, movement.quantity);
      }
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

StockMovement.findByStoreAndProduct = async (storeId, productId, options = {}) => {
  try {
    const cacheKey = `stock:${storeId}:${productId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const movement = await StockMovement.findOne({
      where: {
        store_id: storeId,
        product_id: productId
      },
      include: [
        { association: 'product', attributes: ['id', 'name'] },
        { association: 'store', attributes: ['id', 'name'] }
      ],
      ...options
    });

    if (movement) {
      await redis.set(cacheKey, JSON.stringify(movement.toJSON()), 'EX', 3600);
    }
    
    return movement;
  } catch (error) {
    throw new Error('Error finding stock movement: ' + error.message);
  }
};

StockMovement.StockAdjustment = async (productId, movement, userId, options = {}) => {
  try {
    options.userId = userId;
    const quantity = movement.quantity;
    let adjustment;

    const stock = await StockMovement.findByStoreAndProduct(
      movement.store_id, 
      productId,
      options
    );

    if (!stock) {
      throw new Error('Store stock not found');
    }

    switch (movement.movement_type) {
      case 'stock-in':
        adjustment = stock.quantity + quantity;
        break;
      case 'sale':
      case 'manual-removal':
        adjustment = stock.quantity - quantity;
        if (adjustment < 0) {
          throw new Error('Insufficient stock for this operation');
        }
        break;
      default:
        throw new Error('Invalid movement type');
    }

    const [affectedCount, [updatedStock]] = await StockMovement.update(
      {
        quantity: adjustment,
        updated_at: DataTypes.NOW,
        updatedBy: userId
      },
      {
        where: {
          store_id: movement.store_id,
          product_id: productId
        },
        returning: true,
        individualHooks: true,
        ...options
      }
    );
    
    await emitStockUpdate(movement.store_id, productId, adjustment);
    return updatedStock;
  } catch (error) {
    throw new Error('Error adjusting stock: ' + error.message);
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


// const { DataTypes } = require('sequelize');
// const { writeSequelize } = require('../db/database');
// const redis = require('../db/redis');
// const Product = require('./ProductModel');
// const Store = require('./StoreModel');
// const StockMovement = writeSequelize.define('StockMovement', {
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
//     type: DataTypes.ENUM('stock-in', 'sale', 'manual-removal', 'transfer', 'adjustment'),
//     allowNull: false
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     validate: {
//       min: 1
//     }
//   },
//   timestamp: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   createdBy: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   updatedBy: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   deletedBy: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   }
// }, {
//   tableName: 'stock_movements',
//   timestamps: false,
//   paranoid: true,
//   indexes: [
//     { fields: ['product_id'] },
//     { fields: ['store_id'] },
//     { fields: ['timestamp'] }
//   ],
//   hooks: {
//     afterCreate: async (movement, options) => {
//       await redis.set(`movement:${movement.id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
//       await redis.del('movements:all');
//     },
//     afterUpdate: async (movement, options) => {
//       await redis.set(`movement:${movement.id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
//       await redis.del('movements:all');
//     },
//     afterDestroy: async (movement, options) => {
//       await redis.del(`movement:${movement.id}`);
//       await redis.del('movements:all');
//     }
//   }
// });

// // Associations
// StockMovement.associate = (models) => {
//   StockMovement.belongsTo(Product, { 
//     foreignKey: 'product_id', 
//     as: 'product',
//     onDelete: 'CASCADE' 
//   });
  
//   StockMovement.belongsTo(Store, { 
//     foreignKey: 'store_id', 
//     as: 'store',
//     onDelete: 'CASCADE' 
//   });
// };

// // Class Methods
// StockMovement.recordMovement = async (productId, movementData, userId, options = {}) => {
//   try {
//     options.userId = userId;
//     const movement = await StockMovement.create({
//       product_id: productId,
//       store_id: movementData.store_id,
//       movement_type: movementData.movement_type,
//       quantity: movementData.quantity,
//       createdBy: userId,
//       updatedBy: userId
//     }, options);
    
//     return movement;
//   } catch (error) {
//     throw new Error('Error recording stock movement: ' + error.message);
//   }
// };

// StockMovement.getAllStockMovements = async (options = {}) => {
//   try {
//     // Try cache first
//     const cached = await redis.get('movements:all');
//     if (cached) return JSON.parse(cached);

//     const movements = await StockMovement.findAll({
//       include: [
//         { association: 'product', attributes: ['id', 'name', 'product_code'] },
//         { association: 'store', attributes: ['id', 'name'] }
//       ],
//       order: [['timestamp', 'DESC']],
//       ...options
//     });
    
//     // Cache result
//     if (movements.length > 0) {
//       await redis.set('movements:all', JSON.stringify(movements), 'EX', 300);
//     }
    
//     return movements;
//   } catch (error) {
//     throw new Error('Error retrieving stock movements: ' + error.message);
//   }
// };

// StockMovement.findById = async (id, options = {}) => {
//   try {
//     // Try cache first
//     const cached = await redis.get(`movement:${id}`);
//     if (cached) return JSON.parse(cached);

//     const movement = await StockMovement.findOne({
//       where: { id },
//       include: [
//         { association: 'product', attributes: ['id', 'name'] },
//         { association: 'store', attributes: ['id', 'name'] }
//       ],
//       ...options
//     });

//     if (movement) {
//       await redis.set(`movement:${id}`, JSON.stringify(movement.toJSON()), 'EX', 3600);
//     }
    
//     return movement;
//   } catch (error) {
//     throw new Error('Error retrieving stock movement by ID: ' + error.message);
//   }
// };

// StockMovement.findByStoreId = async (storeId, options = {}) => {
//   try {
//     const cacheKey = `movements:store:${storeId}`;
//     const cached = await redis.get(cacheKey);
//     if (cached) return JSON.parse(cached);

//     const movements = await StockMovement.findAll({
//       where: { store_id: storeId },
//       include: [
//         { association: 'product', attributes: ['id', 'name', 'product_code'] }
//       ],
//       order: [['timestamp', 'DESC']],
//       ...options
//     });

//     if (movements.length > 0) {
//       await redis.set(cacheKey, JSON.stringify(movements), 'EX', 300);
//     }
    
//     return movements;
//   } catch (error) {
//     throw new Error('Error retrieving stock movements by store ID: ' + error.message);
//   }
// };

// StockMovement.deleteStock = async (id, userId, options = {}) => {
//   try {
//     options.userId = userId;
    
//     // Soft delete first to trigger hooks
//     await StockMovement.update(
//       { deletedBy: userId },
//       { where: { id }, ...options }
//     );
    
//     const result = await StockMovement.destroy({
//       where: { id },
//       ...options
//     });
    
//     return result;
//   } catch (error) {
//     throw new Error('Error deleting stock movement: ' + error.message);
//   }
// };

// module.exports = StockMovement;





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
