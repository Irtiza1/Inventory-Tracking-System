const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');
const redis = require('../db/redis');
const Store = require('../models/StoreModel');
const Product = require('../models/ProductModel');
const StoreStock = writeSequelize.define('StoreStock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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
  tableName: 'store_stocks',
  timestamps: false,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['store_id', 'product_id'],
    },
    {
      fields: ['store_id']
    },
    {
      fields: ['product_id']
    }
  ],
  hooks: {
    afterCreate: async (stock, options) => {
      await redis.del(`stock:${stock.store_id}:${stock.product_id}`);
      await redis.del('stocks:all');
    },
    afterUpdate: async (stock, options) => {
      await redis.del(`stock:${stock.store_id}:${stock.product_id}`);
      await redis.del('stocks:all');
    },
    afterDestroy: async (stock, options) => {
      await redis.del(`stock:${stock.store_id}:${stock.product_id}`);
      await redis.del('stocks:all');
    }
  }
});

// Associations
StoreStock.associate = (models) => {
  StoreStock.belongsTo(Store, { 
    foreignKey: 'store_id',
    as: 'store',
    onDelete: 'CASCADE'
  });
  
  StoreStock.belongsTo(Product, { 
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
  });
};

// Class Methods
StoreStock.createStoreStock = async (productId, stockData, userId, options = {}) => {
  try {
    options.userId = userId;
    const stock = await StoreStock.create({
      store_id: stockData.store_id,
      product_id: productId,
      quantity: stockData.quantity,
      createdBy: userId,
      updatedBy: userId
    }, options);
    
    return stock;
  } catch (error) {
    throw new Error('Error creating store stock: ' + error.message);
  }
};

StoreStock.findAllStoreStocks = async (options = {}) => {
  try {
    // Try cache first
    const cached = await redis.get('stocks:all');
    if (cached) return JSON.parse(cached);

    const stocks = await StoreStock.findAll({
      include: [
        { association: 'store', attributes: ['id', 'name'] },
        { association: 'product', attributes: ['id', 'name', 'product_code'] }
      ],
      ...options
    });
    
    // Cache result
    if (stocks.length > 0) {
      await redis.set('stocks:all', JSON.stringify(stocks), 'EX', 300);
    }
    
    return stocks;
  } catch (error) {
    throw new Error('Error retrieving store stocks: ' + error.message);
  }
};

StoreStock.findByStoreAndProduct = async (storeId, productId, options = {}) => {
  try {
    const cacheKey = `stock:${storeId}:${productId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const stock = await StoreStock.findOne({
      where: {
        store_id: storeId,
        product_id: productId
      },
      include: [
        { association: 'store', attributes: ['id', 'name'] },
        { association: 'product', attributes: ['id', 'name'] }
      ],
      ...options
    });

    if (stock) {
      await redis.set(cacheKey, JSON.stringify(stock.toJSON()), 'EX', 3600);
    }
    
    return stock;
  } catch (error) {
    throw new Error('Error finding store stock: ' + error.message);
  }
};

StoreStock.updateQuantity = async (storeId, productId, quantity, userId, options = {}) => {
  try {
    options.userId = userId;
    const [affectedCount, [updatedStock]] = await StoreStock.update(
      {
        quantity,
        updated_at: DataTypes.NOW,
        updatedBy: userId
      },
      {
        where: {
          store_id: storeId,
          product_id: productId
        },
        returning: true,
        individualHooks: true,
        ...options
      }
    );
    
    if (affectedCount === 0) {
      throw new Error('Store stock not found');
    }
    
    return updatedStock;
  } catch (error) {
    throw new Error('Error updating stock quantity: ' + error.message);
  }
};

StoreStock.StockAdjustment = async (productId, movement, userId, options = {}) => {
  try {
    options.userId = userId;
    const quantity = movement.quantity;
    let adjustment;

    const stock = await StoreStock.findByStoreAndProduct(
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

    const [affectedCount, [updatedStock]] = await StoreStock.update(
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
    
    return updatedStock;
  } catch (error) {
    throw new Error('Error adjusting stock: ' + error.message);
  }
};

StoreStock.deleteStoreStock = async (storeId, productId, userId, options = {}) => {
  try {
    options.userId = userId;
    
    // Soft delete first to trigger hooks
    await StoreStock.update(
      { deletedBy: userId },
      { 
        where: { 
          store_id: storeId, 
          product_id: productId 
        },
        ...options
      }
    );
    
    const result = await StoreStock.destroy({
      where: {
        store_id: storeId,
        product_id: productId
      },
      ...options
    });
    
    return result;
  } catch (error) {
    throw new Error('Error deleting store stock: ' + error.message);
  }
};

module.exports = StoreStock;

// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../db/database');
// const Store = require('../models/StoreModel');
// const Product = require('../models/ProductModel');

// const StoreStock = sequelize.define('StoreStock', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   store_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Store,
//       key: 'id',
//     },
//   },
//   product_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: Product,
//       key: 'id',
//     },
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.NOW,
//   },
//   createdBy: DataTypes.INTEGER,
//   updatedBy: DataTypes.INTEGER,
//   deletedBy: DataTypes.INTEGER,
// }, {
//   tableName: 'storestock',
//   timestamps: false,
//   paranoid: true,
//   indexes: [
//     {
//       unique: true,
//       fields: ['store_id', 'product_id'], 
//     },
//   ],
// });

// StoreStock.belongsTo(Store, { foreignKey: 'store_id' });
// StoreStock.belongsTo(Product, { foreignKey: 'product_id' });


// StoreStock.createStoreStock = async (productId, stockData,userId) => {
//   return StoreStock.create({
//     store_id: stockData.store_id,
//     product_id: productId,
//     quantity: stockData.quantity,
//     createdBy: userId,
//     updatedBy: userId
//   });
// };

// StoreStock.findAllStoreStocks = async () => {
//   return StoreStock.findAll();
// };

// StoreStock.findByStoreAndProduct = async (storeId, productId) => {
//   return StoreStock.findOne({
//     where: {
//       store_id: storeId,
//       product_id: productId,
//     },
//   });
// };

// StoreStock.updateQuantity = async (storeId, productId, quantity, userId) => {
//   const updatedStock = await StoreStock.update(
//     {
//       quantity,
//       updated_at: Sequelize.NOW,
//       updatedBy: userId
//     },
//     {
//       where: {
//         store_id: storeId,
//         product_id: productId,
//       },
//       returning: true,
//     }
//   );
//   return updatedStock[1][0];
// };

// StoreStock.StockAdjustment = async (productId, movement) => {
//   const quantity = movement.quantity;
//   let updatedQuantity;

//   const storeStock = await StoreStock.findOne({
//     where: {
//       store_id: movement.store_id,
//       product_id: productId,
//     },
//   });

//   if (!storeStock) {
//     throw new Error('StoreStock not found');
//   }

//   if (movement.movement_type === 'stock-in') {
//     updatedQuantity = storeStock.quantity + quantity;
//   } else if (movement.movement_type === 'sale' || movement.movement_type === 'manual-removal') {
//     updatedQuantity = storeStock.quantity - quantity;
//   } else {
//     throw new Error("Invalid movement type");
//   }

//   const updatedStock = await StoreStock.update(
//     {
//       quantity: updatedQuantity,
//       updated_at: Sequelize.NOW,
//       updatedBy: userId
//     },
//     {
//       where: {
//         store_id: movement.store_id,
//         product_id: productId,
//       },
//       returning: true,
//     }
//   );
//   return updatedStock[1][0]; 
// };


// StoreStock.deleteStoreStock = async (storeId, productId, userId) => {
//   await StoreStock.update(
//     { deletedBy: userId },
//     { where: { store_id: storeId, product_id: productId } }
//   );
//   return StoreStock.destroy({
//     where: {
//       store_id: storeId,
//       product_id: productId,
//     },
//   });
// };
// StoreStock.belongsTo(Store, { foreignKey: 'store_id', onDelete: 'CASCADE' });
// StoreStock.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// module.exports = StoreStock;
