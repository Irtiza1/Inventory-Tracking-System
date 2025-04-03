const db = require("../db/database");
const ProductModel = require("./ProductModel");

const InventoryMovementModel = {
  // Core executor (same pattern as ProductModel)
  _execute: function(method, sql, params) {
    return new Promise((resolve, reject) => {
      db[method](sql, params, function(err, result) {
        if (err) return reject(err);
        resolve({
          data: result,
          changes: this.changes,
          lastID: this.lastID
        });
      });
    });
  },

  // Record movement
  recordMovement: async function(productId,movementType, quantity) {
    // 2. Record movement
    return this._execute(
      'run',
      `INSERT INTO InventoryMovement (product_id,movement_type, quantity) 
       VALUES (?, ?, ?)`,
      [productId, movementType, quantity]
    );
  },

  // Get movements
  getMovements: function (productCode) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT I.id, I.product_id, P.product_code, I.movement_type, 
                    I.quantity, I.timestamp 
             FROM InventoryMovement AS I 
             INNER JOIN Products AS P ON I.product_id = P.id 
             WHERE P.product_code = ?;`, 
            [productCode],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
  }


};

module.exports = InventoryMovementModel;

// const db = require("../db/database");
// const ProductModel = require("./ProductModel");

// const InventoryMovementModel = {
//     // Record movement (no transaction)
//     recordMovement: async (productId, movementType, quantity) => {
//         return new Promise((resolve, reject) => {
//             // 1. Update product stock
//             ProductModel.updateStock(productId, quantity)
//                 .then(() => {
//                     // 2. Record movement
//                     const sql = `INSERT INTO InventoryMovements 
//                                 (product_id, movement_type, quantity) 
//                                 VALUES (?, ?, ?)`;
//                     db.run(sql, [productId, movementType, quantity], 
//                         function (err) {
//                             err ? reject(err) : resolve(this.lastID);
//                         }
//                     );
//                 })
//                 .catch(reject);
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


// const db = require("../db/database");

// const InventoryMovementModel = {
//     // Record the inventory movement with a transaction
//     recordMovement: (productId, movementType, quantity, callback) => {
//         // Start the transaction
//         db.run("BEGIN TRANSACTION;", (err) => {
//             if (err) {
//                 console.error("Error starting transaction:", err);
//                 return callback(err);
//             }

//             // Insert the movement into the InventoryMovement table
//             const sql = `INSERT INTO InventoryMovements (product_id, movement_type, quantity) 
//                          VALUES (?, ?, ?)`;

//             db.run(sql, [productId, movementType, quantity], function (err) {
//                 if (err) {
//                     // Rollback if there is an error in the movement insert
//                     return db.run("ROLLBACK;", () => {
//                         console.error("Error recording stock movement:", err);
//                         return callback(err);
//                     });
//                 }

//                 // Commit the transaction if the insert is successful
//                 db.run("COMMIT;", (commitErr) => {
//                     if (commitErr) {
//                         console.error("Error committing transaction:", commitErr);
//                         return callback(commitErr);
//                     }
//                     console.log("Transaction committed successfully.");
//                     callback(null, this.lastID);
//                 });
//             });
//         });
//     },

//     // Get all movements for a product
//     getMovements: (productId, callback) => {
//         db.all("SELECT * FROM InventoryMovements WHERE product_id = ?", [productId], callback);
//     }
// };

// module.exports = InventoryMovementModel;


// const db = require("../db/inventory-v1");

// const InventoryMovementModel = {
//     recordMovement: (productId, movementType, quantity, callback) => {
//         const sql = `INSERT INTO InventoryMovements (product_id, movement_type, quantity) VALUES (?, ?, ?)`;
//         db.run(sql, [productId, movementType, quantity], function (err) {
//             callback(err, this ? this.lastID : null);
//         });
//     },

//     getMovements: (productId, callback) => {
//         db.all("SELECT * FROM InventoryMovements WHERE product_id = ?", [productId], callback);
//     }
// };

// module.exports = InventoryMovementModel;
