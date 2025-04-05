const db = require('../db/database');

const StockMovement = {
  create: async (movement, t = db) => {
    return t.one(
      `INSERT INTO StockMovement (product_id, store_id, movement_type, quantity)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [movement.product_id, movement.store_id, movement.movement_type, movement.quantity]
    );
  },

  findAll: async (t = db) => {
    return t.any('SELECT * FROM StockMovement');
  },

  findById: async (id, t = db) => {
    return t.oneOrNone('SELECT * FROM StockMovement WHERE id = $1', [id]);
  },

  findByStore: async (store_id, t = db) => {
    return t.any(
      `SELECT * FROM StockMovement WHERE store_id = $1 ORDER BY timestamp DESC`,
      [store_id]
    );
  },

  update: async (id, movement, t = db) => {
    return t.oneOrNone(
      `UPDATE StockMovement SET product_id = $1, store_id = $2, movement_type = $3, quantity = $4
       WHERE id = $5 RETURNING *`,
      [movement.product_id, movement.store_id, movement.movement_type, movement.quantity, id]
    );
  },

  delete: async (id, t = db) => {
    return t.result('DELETE FROM StockMovement WHERE id = $1', [id], r => r.rowCount);
  },
};

module.exports = StockMovement;


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
