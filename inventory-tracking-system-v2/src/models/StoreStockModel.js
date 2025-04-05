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
      fields: ['store_id', 'product_id'],  // Ensure store-product uniqueness
    },
  ],
});

// Associations
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
      returning: true, // To return the updated record
    }
  );
  return updatedStock[1][0]; // Return the updated record from the result
};

StoreStock.StockAdjustment = async (productId, movement) => {
  const quantity = movement.quantity;
  let updatedQuantity;

  // Fetch current stock first
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

  // Perform the update
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
  return updatedStock[1][0]; // Return the updated record from the result
};

StoreStock.deleteStoreStock = async (storeId, productId) => {
  const deletedCount = await StoreStock.destroy({
    where: {
      store_id: storeId,
      product_id: productId,
    },
  });
  return deletedCount; // Returns the number of rows affected (deleted)
};
module.exports = StoreStock;

// second option
// const db = require('../db/database');

// const StoreStock = {
//   findAll: async (t = db) => {
//     return t.any('SELECT * FROM storestock');
//   },

//   findByStoreAndProduct: async (storeId, productId, t = db) => {
//     return t.oneOrNone(
//       'SELECT * FROM storestock WHERE store_id = $1 AND product_id = $2',
//       [storeId, productId]
//     );
//   },
// /*StockAdjustment updated */
//   StockAdjustment: async (product_id, movement, t = db) => {
//     const quantity = movement.quantity; 
//     if (movement.movement_type === 'stock-in') {
//       return t.oneOrNone(
//         `UPDATE storestock 
//         SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP 
//         WHERE store_id = $2 AND product_id = $3 
//         RETURNING *`,
//         [quantity, movement.store_id, product_id]
//       );
//     }
//     else if (movement.movement_type === 'sale') {
//       return t.oneOrNone(
//         `UPDATE storestock 
//         SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP 
//         WHERE store_id = $2 AND product_id = $3 
//         RETURNING *`,
//         [quantity, movement.store_id, product_id]
//       );
//     }
//     else if (movement.movement_type === 'manual-removal') {
//       return t.oneOrNone(
//         `UPDATE storestock 
//         SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP 
//         WHERE store_id = $2 AND product_id = $3 
//         RETURNING *`,
//         [quantity, movement.store_id, product_id]
//       );
//     }
//     else {
//       throw new Error("Invalid movement type");
//     }
//   },

//   updateQuantity: async (storeId, productId, quantity, t = db) => {
//     return t.oneOrNone(
//       `UPDATE storestock 
//        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
//        WHERE store_id = $2 AND product_id = $3 
//        RETURNING *`,
//       [quantity, storeId, productId]
//     );
//   },

//   create: async (product_id, stockData, t = db) => {
//     return t.one(
//       `INSERT INTO storestock (store_id, product_id, quantity)
//        VALUES ($1, $2, $3)
//        RETURNING *`,
//       [stockData.store_id, product_id, stockData.quantity]
//     );
//   },
// };

// module.exports = StoreStock;


// const db = require('../db/database');

// const StoreStock = {
//   findAll: async () => {
//     return db.any('SELECT * FROM storestock');
//   },
//   /*look to search by store_id or store name */ 
//   findByStoreAndProduct: async (storeId, productId) => {
//     return db.oneOrNone(
//       'SELECT * FROM storestock WHERE store_id = $1 AND product_id = $2',
//       [storeId, productId]
//     );
//   },
//   /*stockadjacement , can we replace with updateQuantity */
//   StockAdjacement: async (storeId, productId, quantity) => {
//     return db.oneOrNone(
//       `UPDATE storestock 
//        SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP 
//        WHERE store_id = $2 AND product_id = $3 
//        RETURNING *`,
//       [quantity, storeId, productId]
//     );
//   },
//   updateQuantity: async (storeId, productId, quantity) => {
//     return db.oneOrNone(
//       `UPDATE storestock 
//        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
//        WHERE store_id = $2 AND product_id = $3 
//        RETURNING *`,
//       [quantity, storeId, productId]
//     );
//   },
// /*look whether to keep it or not*/
//   create: async ({ store_id, product_id, quantity }) => {
//     return db.one(
//       `INSERT INTO storestock (store_id, product_id, quantity)
//        VALUES ($1, $2, $3)
//        RETURNING *`,
//       [store_id, product_id, quantity]
//     );
//   },
// };

// module.exports = StoreStock;
