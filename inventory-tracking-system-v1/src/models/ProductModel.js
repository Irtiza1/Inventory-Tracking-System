const db = require("../db/database");

const ProductModel = {
  // Core query executor (private)
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

  // Public methods
  create: function({ name, productCode, price, initialQuantity }) {
    return this._execute(
      'run',
      `INSERT INTO Products (name, product_code, price, initial_quantity, available_quantity) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, productCode, price, initialQuantity, initialQuantity]
    );
  },

  getAll: function() {
    return this._execute('all', 'SELECT * FROM Products', []);
  },

  getById: function(id) {
    return this._execute('get', 'SELECT * FROM Products WHERE id = ?', [id]);
  },

  updateStock: function(productId, quantity) {
    return this._execute(
      'run',
      `UPDATE Products SET available_quantity = available_quantity + ? 
       WHERE id = ?`,
      [quantity, productId]
    );
  },

  getCurrentStock: function(productId) {
    return this._execute(
      'get',
      'SELECT available_quantity FROM Products WHERE id = ?',
      [productId]
    );
  },

  delete: function(id) {
    return this._execute('run', 'DELETE FROM Products WHERE id = ?', [id]);
  }
};

module.exports = ProductModel;



// const db = require("../db/database");

// const ProductModel = {
//     // Create a new product
//     create: async (name, productCode, price, initialQuantity) => {
//         const sql = `INSERT INTO Products (name, product_code, price, initial_quantity, available_quantity) 
//                      VALUES (?, ?, ?, ?, ?)`;
//         return new Promise((resolve, reject) => {
//             db.run(sql, [name, productCode, price, initialQuantity, initialQuantity], 
//                 function (err) {
//                     err ? reject(err) : resolve(this.lastID);
//                 }
//             );
//         });
//     },

//     // Get all products
//     getAll: async () => {
//         return new Promise((resolve, reject) => {
//             db.all("SELECT * FROM Products", [], (err, rows) => {
//                 err ? reject(err) : resolve(rows);
//             });
//         });
//     },

//     // Get product by ID
//     getById: async (id) => {
//         return new Promise((resolve, reject) => {
//             db.get("SELECT * FROM Products WHERE id = ?", [id], (err, row) => {
//                 err ? reject(err) : resolve(row);
//             });
//         });
//     },

//     // Update stock (atomic operation)
//     updateStock: async (productId, quantity) => {
//         return new Promise((resolve, reject) => {
//             const sql = `UPDATE Products 
//                          SET available_quantity = available_quantity + ? 
//                          WHERE id = ?`;
//             db.run(sql, [quantity, productId], function (err) {
//                 err ? reject(err) : resolve(this.changes);
//             });
//         });
//     },

//     // Get current stock
//     getCurrentStock: async (productId) => {
//         return new Promise((resolve, reject) => {
//             db.get("SELECT available_quantity FROM Products WHERE id = ?", 
//                 [productId], 
//                 (err, row) => {
//                     err ? reject(err) : resolve(row?.available_quantity);
//                 }
//             );
//         });
//     },

//     // Delete product
//     deleteProduct: async (productId) => {
//         return new Promise((resolve, reject) => {
//             db.run("DELETE FROM Products WHERE id = ?", [id], function (err) {
//                 err ? reject(err) : resolve(this.changes);
//             });
//         });
//     }
// };

// module.exports = ProductModel;

// const db = require("../db/database");

// const ProductModel = {
//     // Create a new product in the Products table
//     create: (name, productCode, price, initialQuantity, callback) => {
//         const sql = `INSERT INTO Products (name, product_code, price, initial_quantity, available_quantity) 
//                      VALUES (?, ?, ?, ?, ?)`;
//         db.run(sql, [name, productCode, price, initialQuantity, initialQuantity], function (err) {
//             callback(err, this ? this.lastID : null);
//         });
//     },

//     // Get all products
//     getAll: (callback) => {
//         db.all("SELECT * FROM Products", [], callback);
//     },

//     // Get a product by its ID
//     getById: (id, callback) => {
//         db.get("SELECT * FROM Products WHERE id = ?", [id], callback);
//     },

//     // Update the available stock (quantity) for a product with transaction
//     updateStock: (productId, quantity, movementType, callback) => {
//         // Begin the transaction
//         db.run("BEGIN TRANSACTION;", (err) => {
//             if (err) {
//                 console.error("Error starting transaction:", err);
//                 return callback(err);
//             }

//             // Update available stock in the Products table
//             const sql = `UPDATE Products 
//                          SET available_quantity = available_quantity + ? 
//                          WHERE id = ?`;
//             db.run(sql, [quantity, productId], function (err) {
//                 if (err) {
//                     // Rollback if there is an error
//                     return db.run("ROLLBACK;", () => {
//                         console.error("Error updating stock:", err);
//                         return callback(err);
//                     });
//                 }

//                 // Insert the movement into the InventoryMovement table
//                 const movementSql = `INSERT INTO InventoryMovement (product_id, movement_type, quantity) 
//                                      VALUES (?, ?, ?)`;
//                 db.run(movementSql, [productId, movementType, quantity], function (movementErr) {
//                     if (movementErr) {
//                         // Rollback if there is an error in the movement insert
//                         return db.run("ROLLBACK;", () => {
//                             console.error("Error recording stock movement:", movementErr);
//                             return callback(movementErr);
//                         });
//                     }

//                     // Commit the transaction if both operations succeed
//                     db.run("COMMIT;", (commitErr) => {
//                         if (commitErr) {
//                             console.error("Error committing transaction:", commitErr);
//                             return callback(commitErr);
//                         }
//                         console.log("Transaction committed successfully.");
//                         callback(null);
//                     });
//                 });
//             });
//         });
//     },

//     // Get the current available stock for a product
//     getCurrentStock: (productId, callback) => {
//         db.get("SELECT available_quantity FROM Products WHERE id = ?", [productId], callback);
//     }
// };

// module.exports = ProductModel;



// const db = require("../db/inventory-v1");

// const ProductModel = {
//     // Create a new product in the Products table
//     create: (name, productCode, price, initialQuantity, callback) => {
//         const sql = `INSERT INTO Products (name, product_code, price, initial_quantity, available_quantity) 
//                      VALUES (?, ?, ?, ?, ?)`;
//         db.run(sql, [name, productCode, price, initialQuantity, initialQuantity], function (err) {
//             callback(err, this ? this.lastID : null);
//         });
//     },

//     // Get all products
//     getAll: (callback) => {
//         db.all("SELECT * FROM Products", [], callback);
//     },

//     // Get a product by its ID
//     getById: (id, callback) => {
//         db.get("SELECT * FROM Products WHERE id = ?", [id], callback);
//     },

//     // Update the available stock (quantity) for a product
//     updateStock: (productId, quantity, movementType, callback) => {
//         const sql = `UPDATE Products 
//                      SET available_quantity = available_quantity + ? 
//                      WHERE id = ?`;

//         // Update available stock in the Products table
//         db.run(sql, [quantity, productId], function (err) {
//             if (err) return callback(err);

//             // Insert the movement into the InventoryMovement table
//             const movementSql = `INSERT INTO InventoryMovement (product_id, movement_type, quantity) 
//                                  VALUES (?, ?, ?)`;
//             db.run(movementSql, [productId, movementType, quantity], function (movementErr) {
//                 callback(movementErr);
//             });
//         });
//     },

//     // Get the current available stock for a product
//     getCurrentStock: (productId, callback) => {
//         db.get("SELECT available_quantity FROM Products WHERE id = ?", [productId], callback);
//     }
// };

// module.exports = ProductModel;
