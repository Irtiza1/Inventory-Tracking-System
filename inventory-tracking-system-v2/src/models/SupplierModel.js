const db = require('../db/database');

const Supplier = {
  create: async (supplier, t = db) => {
    return t.one(
      `INSERT INTO Supplier (name, contact_info)
       VALUES ($1, $2) RETURNING *`,
      [supplier.name, supplier.contact_info]
    );
  },

  findAll: async (t = db) => {
    return t.any('SELECT * FROM Supplier');
  },

  findById: async (id, t = db) => {
    return t.oneOrNone('SELECT * FROM Supplier WHERE id = $1', [id]);
  },

  update: async (id, supplier, t = db) => {
    return t.oneOrNone(
      `UPDATE Supplier SET name = $1, contact_info = $2
       WHERE id = $3 RETURNING *`,
      [supplier.name, supplier.contact_info, id]
    );
  },

  delete: async (id, t = db) => {
    return t.result('DELETE FROM Supplier WHERE id = $1', [id], r => r.rowCount);
  },
};

module.exports = Supplier;


// const db = require('../db/database');

// const Supplier = {
//   create: async (supplier) => {
//     return db.one(
//       `INSERT INTO Supplier (name, contact_info)
//        VALUES ($1, $2) RETURNING *`,
//       [supplier.name, supplier.contact_info]
//     );
//   },
//   findAll: async () => {
//     return db.any('SELECT * FROM Supplier');
//   },
//   findById: async (id) => {
//     return db.oneOrNone('SELECT * FROM Supplier WHERE id = $1', [id]);
//   },
//   update: async (id, supplier) => {
//     return db.oneOrNone(
//       `UPDATE Supplier SET name = $1, contact_info = $2
//        WHERE id = $3 RETURNING *`,
//       [supplier.name, supplier.contact_info, id]
//     );
//   },
//   delete: async (id) => {
//     return db.result('DELETE FROM Supplier WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = Supplier;
