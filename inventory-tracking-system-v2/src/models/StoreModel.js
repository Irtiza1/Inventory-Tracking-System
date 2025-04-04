const db = require('../db/database');

const Store = {
  create: async (store) => {
    return db.one(
      `INSERT INTO Store (name, location)
       VALUES ($1, $2) RETURNING *`,
      [store.name, store.location]
    );
  },
  findAll: async () => {
    return db.any('SELECT * FROM Store');
  },
  findById: async (id) => {
    return db.oneOrNone('SELECT * FROM Store WHERE id = $1', [id]);
  },
  update: async (id, store) => {
    return db.oneOrNone(
      `UPDATE Store SET name = $1, location = $2
       WHERE id = $3 RETURNING *`,
      [store.name, store.location, id]
    );
  },
  delete: async (id) => {
    return db.result('DELETE FROM Store WHERE id = $1', [id], r => r.rowCount);
  },
};

module.exports = Store;
