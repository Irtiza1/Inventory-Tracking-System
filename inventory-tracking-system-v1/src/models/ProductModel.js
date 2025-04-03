const db = require("../db/database");

const ProductModel = {
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

  getById: function(productCode) {
    return this._execute('get', 'SELECT * FROM Products WHERE product_code = ?', [productCode]);
  },

  getIdByCode: function(productCode) {
    return this._execute('get', 'SELECT id FROM Products WHERE product_code = ?', [productCode]);
  },
  updateStock: function(productCode, quantity) {
    return this._execute(
      'run',
      `UPDATE Products SET available_quantity = available_quantity + ? 
       WHERE product_code = ?`,
      [quantity, productCode]
    );
  },

  getCurrentStock: function(productCode) {
    return this._execute(
      'get',
      'SELECT available_quantity FROM Products WHERE product_code = ?',
      [productCode]
    );
  },

  delete: function(productCode) {
    return this._execute('run', 'DELETE FROM Products WHERE product_code = ?', [productCode]);
  }
};

module.exports = ProductModel;