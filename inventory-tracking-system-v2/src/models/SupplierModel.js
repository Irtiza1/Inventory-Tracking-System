const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/database'); // Import sequelize instance

// Define the Supplier model
const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'supplier', // The name of the table in the database
  timestamps: false, // Disable automatic creation of 'created_at' and 'updated_at'
  underscored: true, // Use snake_case for column names
});

// Define the associations (if needed)
Supplier.associate = models => {
  Supplier.hasMany(models.Product, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
  Supplier.hasMany(models.UserAccount, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
};

// Define the static methods to replicate the behavior of the original model

Supplier.createSupplier = async (supplier) => {
  return Supplier.create({
    name: supplier.name,
    contact_info: supplier.contact_info
  });
};

Supplier.findAllSuppliers = async () => {
  return Supplier.findAll();
};

Supplier.findById = async (id) => {
  return Supplier.findOne({
    where: { id }
  });
};

Supplier.updateSupplier = async (id, supplier) => {
  const updatedSupplier = await Supplier.update(
    {
      name: supplier.name,
      contact_info: supplier.contact_info
    },
    {
      where: { id },
      returning: true, // Return the updated record
    }
  );
  return updatedSupplier[1][0]; // Return the updated supplier
};

Supplier.deleteSupplier = async (id) => {
  const deletedCount = await Supplier.destroy({
    where: { id }
  });
  return deletedCount; // Returns the number of rows affected (deleted)
};

module.exports = Supplier;

// second opt
//  const db = require('../db/database');

// const Supplier = {
//   create: async (supplier, t = db) => {
//     return t.one(
//       `INSERT INTO Supplier (name, contact_info)
//        VALUES ($1, $2) RETURNING *`,
//       [supplier.name, supplier.contact_info]
//     );
//   },

//   findAll: async (t = db) => {
//     return t.any('SELECT * FROM Supplier');
//   },

//   findById: async (id, t = db) => {
//     return t.oneOrNone('SELECT * FROM Supplier WHERE id = $1', [id]);
//   },

//   update: async (id, supplier, t = db) => {
//     return t.oneOrNone(
//       `UPDATE Supplier SET name = $1, contact_info = $2
//        WHERE id = $3 RETURNING *`,
//       [supplier.name, supplier.contact_info, id]
//     );
//   },

//   delete: async (id, t = db) => {
//     return t.result('DELETE FROM Supplier WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = Supplier;


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
