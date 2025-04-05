const db = require('../db/database');

const StoreStock = {
  findAll: async (t = db) => {
    return t.any('SELECT * FROM storestock');
  },

  findByStoreAndProduct: async (storeId, productId, t = db) => {
    return t.oneOrNone(
      'SELECT * FROM storestock WHERE store_id = $1 AND product_id = $2',
      [storeId, productId]
    );
  },

  StockAdjacement: async (storeId, productId, quantity, t = db) => {
    return t.oneOrNone(
      `UPDATE storestock 
       SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP 
       WHERE store_id = $2 AND product_id = $3 
       RETURNING *`,
      [quantity, storeId, productId]
    );
  },

  updateQuantity: async (storeId, productId, quantity, t = db) => {
    return t.oneOrNone(
      `UPDATE storestock 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE store_id = $2 AND product_id = $3 
       RETURNING *`,
      [quantity, storeId, productId]
    );
  },

  create: async ({ store_id, product_id, quantity }, t = db) => {
    return t.one(
      `INSERT INTO storestock (store_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [store_id, product_id, quantity]
    );
  },
};

module.exports = StoreStock;


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
