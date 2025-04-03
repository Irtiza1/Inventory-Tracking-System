const db = require("../db/database");
const ProductModel = require("./ProductModel");

const InventoryMovementModel = {
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

  recordMovement: async function(productId,movementType, quantity) {
    return this._execute(
      'run',
      `INSERT INTO InventoryMovement (product_id,movement_type, quantity) 
       VALUES (?, ?, ?)`,
      [productId, movementType, quantity]
    );
  },

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
