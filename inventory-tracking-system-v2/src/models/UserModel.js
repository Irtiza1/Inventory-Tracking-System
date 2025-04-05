const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Import sequelize instance

// Define the UserAccount model
const UserAccount = sequelize.define('UserAccount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['admin', 'store-manager', 'analytics', 'supplier']]
    }
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'useraccount', // The name of the table in the database
  timestamps: false, // Disable automatic creation of 'created_at' and 'updated_at'
  underscored: true, // Use snake_case for column names
});

// Define the associations (if needed)
UserAccount.associate = models => {
  // A user can belong to one store (optional) and one supplier (optional)
  UserAccount.belongsTo(models.Store, { foreignKey: 'store_id', onDelete: 'SET NULL' });
  UserAccount.belongsTo(models.Supplier, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
};

// Static methods to replicate the behavior of the original model

UserAccount.createUser = async (user) => {
  return UserAccount.create({
    username: user.username,
    password_hash: user.password_hash,
    role: user.role,
    store_id: user.store_id,
    supplier_id: user.supplier_id
  });
};

UserAccount.findAllUsers = async () => {
  return UserAccount.findAll();
};

UserAccount.findById = async (id) => {
  return UserAccount.findOne({
    where: { id }
  });
};

UserAccount.findByUsername = async (username) => {
  return UserAccount.findOne({
    where: { username }
  });
};

UserAccount.updateUser = async (id, user) => {
  const updatedUser = await UserAccount.update(
    {
      username: user.username,
      password_hash: user.password_hash,
      role: user.role,
      store_id: user.store_id,
      supplier_id: user.supplier_id
    },
    {
      where: { id },
      returning: true, // Return the updated record
    }
  );
  return updatedUser[1][0]; // Return the updated user
};

UserAccount.deleteUser = async (id) => {
  const deletedCount = await UserAccount.destroy({
    where: { id }
  });
  return deletedCount; // Returns the number of rows affected (deleted)
};

module.exports = UserAccount;


// const db = require('../db/database');

// const User = {
//   create: async (user) => {
//     return db.one(
//       `INSERT INTO UserAccount (username, password_hash, role, store_id, supplier_id)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [user.username, user.password_hash, user.role, user.store_id, user.supplier_id]
//     );
//   },
//   findAll: async () => {
//     return db.any('SELECT * FROM UserAccount');
//   },
//   findById: async (id) => {
//     return db.oneOrNone('SELECT * FROM UserAccount WHERE id = $1', [id]);
//   },
//   findByUsername: async (username) => {
//     return db.oneOrNone('SELECT * FROM UserAccount WHERE username = $1', [username]);
//   },
//   update: async (id, user) => {
//     return db.oneOrNone(
//       `UPDATE UserAccount SET username = $1, password_hash = $2, role = $3, store_id = $4, supplier_id = $5
//        WHERE id = $6 RETURNING *`,
//       [user.username, user.password_hash, user.role, user.store_id, user.supplier_id, id]
//     );
//   },
//   delete: async (id) => {
//     return db.result('DELETE FROM UserAccount WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = User;
