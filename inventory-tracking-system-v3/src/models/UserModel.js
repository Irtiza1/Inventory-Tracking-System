const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');
const redis = require('../db/redis');

const UserAccount = writeSequelize.define('UserAccount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  deletedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'user_accounts',
  timestamps: false,
  underscored: true,
  paranoid: true,
  indexes: [
    { fields: ['username'] },
    { fields: ['role'] },
    { fields: ['store_id'] },
    { fields: ['supplier_id'] }
  ],
  hooks: {
    afterCreate: async (user, options) => {
      await redis.set(`user:${user.id}`, JSON.stringify(user.toJSON()), 'EX', 3600);
      await redis.del('users:all');
    },
    afterUpdate: async (user, options) => {
      await redis.set(`user:${user.id}`, JSON.stringify(user.toJSON()), 'EX', 3600);
      await redis.del('users:all');
    },
    afterDestroy: async (user, options) => {
      await redis.del(`user:${user.id}`);
      await redis.del('users:all');
    }
  }
});

// // Associations
// UserAccount.associate = (models) => {
//   UserAccount.belongsTo(models.Store, { 
//     foreignKey: 'store_id',
//     as: 'store',
//     onDelete: 'SET NULL'
//   });
  
//   UserAccount.belongsTo(models.Supplier, { 
//     foreignKey: 'supplier_id',
//     as: 'supplier',
//     onDelete: 'SET NULL'
//   });
// };

// Class Methods
UserAccount.createUser = async (userData, userId, options = {}) => {
  try {
    options.userId = userId;
    const user = await UserAccount.create({
      ...userData,
      createdBy: userId,
      updatedBy: userId
    }, options);
    
    return user;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

UserAccount.findAllUsers = async (options = {}) => {
  try {
    // Try cache first
    const cached = await redis.get('users:all');
    if (cached) return JSON.parse(cached);

    const users = await UserAccount.findAll({
      include: [
        { association: 'store', attributes: ['id', 'name'] },
        { association: 'supplier', attributes: ['id', 'name'] }
      ],
      ...options
    });
    
    // Cache result
    if (users.length > 0) {
      await redis.set('users:all', JSON.stringify(users), 'EX', 300);
    }
    
    return users;
  } catch (error) {
    throw new Error('Error retrieving users: ' + error.message);
  }
};

UserAccount.findById = async (id, options = {}) => {
  try {
    // Try cache first
    const cached = await redis.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    const user = await UserAccount.findOne({
      where: { id },
      include: [
        { association: 'store', attributes: ['id', 'name'] },
        { association: 'supplier', attributes: ['id', 'name'] }
      ],
      ...options
    });

    if (user) {
      await redis.set(`user:${id}`, JSON.stringify(user.toJSON()), 'EX', 3600);
    }
    
    return user;
  } catch (error) {
    throw new Error('Error finding user by ID: ' + error.message);
  }
};

UserAccount.findByUsername = async (username, options = {}) => {
  try {
    const user = await UserAccount.findOne({
      where: { username },
      ...options
    });
    
    return user;
  } catch (error) {
    throw new Error('Error finding user by username: ' + error.message);
  }
};

UserAccount.updateUser = async (id, userData, userId, options = {}) => {
  try {
    options.userId = userId;
    const [affectedCount, [updatedUser]] = await UserAccount.update(
      {
        ...userData,
        updatedBy: userId
      },
      {
        where: { id },
        returning: true,
        individualHooks: true,
        ...options
      }
    );
    
    if (affectedCount === 0) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};

UserAccount.deleteUser = async (id, userId, options = {}) => {
  try {
    options.userId = userId;
    
    // Soft delete first to trigger hooks
    await UserAccount.update(
      { deletedBy: userId },
      { where: { id }, ...options }
    );
    
    const result = await UserAccount.destroy({
      where: { id },
      ...options
    });
    
    return result;
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

module.exports = UserAccount;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/database'); 

// const UserAccount = sequelize.define('UserAccount', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   username: {
//     type: DataTypes.STRING(255),
//     unique: true,
//     allowNull: false
//   },
//   password_hash: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   role: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//     validate: {
//       isIn: [['admin', 'store-manager', 'analytics', 'supplier']]
//     }
//   },
//   store_id: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   supplier_id: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   createdBy: {
//   type: DataTypes.INTEGER,
//   },
//   updatedBy: {
//     type: DataTypes.INTEGER,
//   },
//   deletedBy: {
//     type: DataTypes.INTEGER,
//   },
// }, {
//   tableName: 'useraccount', 
//   timestamps: false, 
//   underscored: true, 
//   paranoid: true,

// });

// UserAccount.associate = models => {
//   UserAccount.belongsTo(models.Store, { foreignKey: 'store_id', onDelete: 'SET NULL' });
//   UserAccount.belongsTo(models.Supplier, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
// };

// UserAccount.createUser = async (user) => {
//   return UserAccount.create({
//     username: user.username,
//     password_hash: user.password_hash,
//     role: user.role,
//     store_id: user.store_id,
//     supplier_id: user.supplier_id
//   });
// };

// UserAccount.findAllUsers = async () => {
//   return UserAccount.findAll();
// };

// UserAccount.findById = async (id) => {
//   return UserAccount.findOne({
//     where: { id }
//   });
// };

// UserAccount.findByUsername = async (username) => {
//   return UserAccount.findOne({
//     where: { username }
//   });
// };

// UserAccount.updateUser = async (id, user) => {
//   const updatedUser = await UserAccount.update(
//     {
//       username: user.username,
//       password_hash: user.password_hash,
//       role: user.role,
//       store_id: user.store_id,
//       supplier_id: user.supplier_id
//     },
//     {
//       where: { id },
//       returning: true, 
//     }
//   );
//   return updatedUser[1][0]; 
// };

// UserAccount.deleteUser = async (id) => {
//   const deletedCount = await UserAccount.destroy({
//     where: { id }
//   });
//   return deletedCount; 
// };

// module.exports = UserAccount;
