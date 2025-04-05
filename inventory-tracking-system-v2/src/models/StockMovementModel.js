const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Product = require('../models/ProductModel');
const Store = require('../models/StoreModel');

// Define the StockMovement model
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

// Define associations
StockMovement.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
StockMovement.belongsTo(Store, { foreignKey: 'store_id', onDelete: 'CASCADE' });

// StockMovement model methods
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


// second opt
// const db = require('../db/database');

// const StockMovement = {
//   recordMovement: async (product_id,movement, t = db) => {
//     return t.one(
//       `INSERT INTO StockMovement (product_id, store_id, movement_type, quantity)
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [product_id, movement.store_id, movement.movement_type, movement.quantity]
//     );
//   },

//   findAll: async (t = db) => {
//     return t.any('SELECT * FROM StockMovement');
//   },

//   findById: async (id, t = db) => {
//     return t.oneOrNone('SELECT * FROM StockMovement WHERE id = $1', [id]);
//   },
 
//   findByStoreId: async (store_id, t = db) => {
//     return t.any(
//       `SELECT * FROM StockMovement WHERE store_id = $1 ORDER BY timestamp DESC`,
//       [store_id]
//     );
//   },

//   // update: async (id, movement, t = db) => {
//   //   return t.oneOrNone(
//   //     `UPDATE StockMovement SET product_id = $1, store_id = $2, movement_type = $3, quantity = $4
//   //      WHERE id = $5 RETURNING *`,
//   //     [movement.product_id, movement.store_id, movement.movement_type, movement.quantity, id]
//   //   );
//   // },

//   delete: async (id, t = db) => {
//     return t.result('DELETE FROM StockMovement WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = StockMovement;


// const db = require('../db/database');

// const StockMovement = {
//   create: async (movement) => {
//     return db.one(
//       `INSERT INTO StockMovement (product_id, store_id, movement_type, quantity)
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [movement.product_id, movement.store_id, movement.movement_type, movement.quantity]
//     );
//   },
//   findAll: async () => {
//     return db.any('SELECT * FROM StockMovement');
//   },
//   findById: async (id) => {
//     return db.oneOrNone('SELECT * FROM StockMovement WHERE id = $1', [id]);
//   },

//   findByStore: async (store_id) => {
//     return db.any(
//       `SELECT * FROM StockMovement WHERE store_id = $1 ORDER BY timestamp DESC`,
//       [store_id]
//     );
//   },
//   update: async (id, movement) => {
//     return db.oneOrNone(
//       `UPDATE StockMovement SET product_id = $1, store_id = $2, movement_type = $3, quantity = $4
//        WHERE id = $5 RETURNING *`,
//       [movement.product_id, movement.store_id, movement.movement_type, movement.quantity, id]
//     );
//   },
//   delete: async (id) => {
//     return db.result('DELETE FROM StockMovement WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = StockMovement;



// const db = require("../db/database");
// const ProductModel = require("./ProductModel");

// const InventoryMovementModel = {
//     // Record movement with transaction
//     recordMovement: async (productId, movementType, quantity) => {
//         return new Promise((resolve, reject) => {
//             db.run("BEGIN TRANSACTION;", async (err) => {
//                 if (err) return reject(err);

//                 try {
//                     // 1. Update product stock
//                     await ProductModel.updateStock(productId, quantity);
                    
//                     // 2. Record movement
//                     const sql = `INSERT INTO InventoryMovements 
//                                 (product_id, movement_type, quantity) 
//                                 VALUES (?, ?, ?)`;
                    
//                     db.run(sql, [productId, movementType, quantity], 
//                         function (movementErr) {
//                             if (movementErr) {
//                                 return db.run("ROLLBACK;", () => reject(movementErr));
//                             }
                            
//                             db.run("COMMIT;", (commitErr) => {
//                                 commitErr ? reject(commitErr) : resolve(this.lastID);
//                             });
//                         }
//                     );
//                 } catch (error) {
//                     db.run("ROLLBACK;", () => reject(error));
//                 }
//             });
//         });
//     },

//     // Get all movements for a product
//     getMovements: async (productId) => {
//         return new Promise((resolve, reject) => {
//             db.all("SELECT * FROM InventoryMovements WHERE product_id = ?", 
//                 [productId], 
//                 (err, rows) => {
//                     err ? reject(err) : resolve(rows);
//                 }
//             );
//         });
//     }
// };

// module.exports = InventoryMovementModel;
