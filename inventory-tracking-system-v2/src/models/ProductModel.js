// models/product.js
const db = require('../db/database');

const Product = {
  create: async (product) => {
    return db.one(
      `INSERT INTO Product (name, product_code, price, initial_quantity, supplier_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product.name, product.product_code, product.price, product.initial_quantity, product.supplier_id]
    );
  },
  findAll: async () => {
    return db.any('SELECT * FROM Product');
  },
  findById: async (id) => {
    return db.oneOrNone('SELECT * FROM Product WHERE id = $1', [id]);
  },
  update: async (id, product) => {
    return db.oneOrNone(
      `UPDATE Product SET name = $1, product_code = $2, price = $3, initial_quantity = $4, supplier_id = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [product.name, product.product_code, product.price, product.initial_quantity, product.supplier_id, id]
    );
  },
  delete: async (id) => {
    return db.result('DELETE FROM Product WHERE id = $1', [id], r => r.rowCount);
  },
};

module.exports = Product;



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
//     }
// };

// module.exports = ProductModel;
