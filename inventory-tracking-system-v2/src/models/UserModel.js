const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); 

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
  tableName: 'useraccount', 
  timestamps: false, 
  underscored: true, 
});

UserAccount.associate = models => {
  UserAccount.belongsTo(models.Store, { foreignKey: 'store_id', onDelete: 'SET NULL' });
  UserAccount.belongsTo(models.Supplier, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
};

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
      returning: true, 
    }
  );
  return updatedUser[1][0]; 
};

UserAccount.deleteUser = async (id) => {
  const deletedCount = await UserAccount.destroy({
    where: { id }
  });
  return deletedCount; 
};

module.exports = UserAccount;
