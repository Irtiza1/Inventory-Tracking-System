const db = require('../db/database');

const User = {
  create: async (user) => {
    return db.one(
      `INSERT INTO UserAccount (username, password_hash, role, store_id, supplier_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.username, user.password_hash, user.role, user.store_id, user.supplier_id]
    );
  },
  findAll: async () => {
    return db.any('SELECT * FROM UserAccount');
  },
  findById: async (id) => {
    return db.oneOrNone('SELECT * FROM UserAccount WHERE id = $1', [id]);
  },
  findByUsername: async (username) => {
    return db.oneOrNone('SELECT * FROM UserAccount WHERE username = $1', [username]);
  },
  update: async (id, user) => {
    return db.oneOrNone(
      `UPDATE UserAccount SET username = $1, password_hash = $2, role = $3, store_id = $4, supplier_id = $5
       WHERE id = $6 RETURNING *`,
      [user.username, user.password_hash, user.role, user.store_id, user.supplier_id, id]
    );
  },
  delete: async (id) => {
    return db.result('DELETE FROM UserAccount WHERE id = $1', [id], r => r.rowCount);
  },
};

module.exports = User;
