const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');
const redis = require('../db/redis');

const Store = writeSequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  location: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 255]
    }
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
  tableName: 'stores',
  timestamps: false,
  paranoid: true,
  hooks: {
    afterCreate: async (store, options) => {
      await redis.set(`store:${store.id}`, JSON.stringify(store.toJSON()), 'EX', 3600);
    },
    afterUpdate: async (store, options) => {
      await redis.set(`store:${store.id}`, JSON.stringify(store.toJSON()), 'EX', 3600);
      await redis.del('stores:all');
    },
    afterDestroy: async (store, options) => {
      await redis.del(`store:${store.id}`);
      await redis.del('stores:all');
    }
  }
});

Store.createStore = async (storeData, userId, options = {}) => {
  try {
    options.userId = userId;
    const store = await Store.create({
      ...storeData,
      createdBy: userId,
      updatedBy: userId
    }, options);
    
    return store;
  } catch (error) {
    throw new Error('Error creating store: ' + error.message);
  }
};

Store.findAllStores = async (options = {}) => {
  try {
    const cached = await redis.get('stores:all');
    if (cached) return JSON.parse(cached);

    const stores = await Store.findAll(options);
    
    if (stores.length > 0) {
      await redis.set('stores:all', JSON.stringify(stores), 'EX', 300);
    }
    
    return stores;
  } catch (error) {
    throw new Error('Error retrieving stores: ' + error.message);
  }
};

Store.findByIdOrName = async ({ id, name }, options = {}) => {
  try {
    if (!id && !name) {
      throw new Error('Either id or name must be provided');
    }

    let store;
    if (id) {
      const cached = await redis.get(`store:${id}`);
      if (cached) return JSON.parse(cached);

      store = await Store.findOne({ 
        where: { id },
        ...options
      });

      if (store) {
        await redis.set(`store:${id}`, JSON.stringify(store.toJSON()), 'EX', 3600);
      }
    } else if (name) {
      store = await Store.findOne({ 
        where: { name },
        ...options
      });
    }

    return store;
  } catch (error) {
    throw new Error('Error finding store by id or name: ' + error.message);
  }
};

Store.updateByIdOrName = async ({ id, name }, storeData, userId, options = {}) => {
  try {
    options.userId = userId;
    const dataToUpdate = {
      ...storeData,
      updatedBy: userId
    };

    if (!id && !name) {
      throw new Error('Either id or name must be provided');
    }

    let whereClause;
    if (id) {
      whereClause = { id };
    } else {
      whereClause = { name };
    }

    const [affectedCount, [updatedStore]] = await Store.update(
      dataToUpdate,
      {
        where: whereClause,
        returning: true,
        individualHooks: true,
        ...options
      }
    );

    if (affectedCount === 0) {
      throw new Error('Store not found');
    }

    return updatedStore;
  } catch (error) {
    throw new Error('Error updating store: ' + error.message);
  }
};

Store.deleteByIdOrName = async ({ id, name }, userId, options = {}) => {
  try {
    options.userId = userId;
    
    let whereClause;
    if (id) {
      whereClause = { id };
    } else if (name) {
      whereClause = { name };
    } else {
      throw new Error('Either id or name must be provided');
    }

    await Store.update(
      { deletedBy: userId },
      { where: whereClause, ...options }
    );
    
    const result = await Store.destroy({
      where: whereClause,
      ...options
    });
    
    return result;
  } catch (error) {
    throw new Error('Error deleting store: ' + error.message);
  }
};

// Associations
// Store.associate = (models) => {
//   Store.hasMany(models.Inventory, {
//     foreignKey: 'store_id',
//     as: 'store'
//   });
// };

module.exports = Store;
