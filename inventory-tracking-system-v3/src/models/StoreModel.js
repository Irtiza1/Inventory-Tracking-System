const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'store',
  timestamps: false
});


Store.createStore = async (store) => {
  try {
    const newStore = await Store.create({
      name: store.name,
      location: store.location
    });
    return newStore;
  } catch (error) {
    throw new Error('Error creating store: ' + error.message);
  }
};

Store.findAllStores = async () => {
  try {
    const stores = await Store.findAll();
    return stores;
  } catch (error) {
    throw new Error('Error retrieving stores: ' + error.message);
  }
};

Store.findByIdOrName = async ({ id, name }) => {
  try {
    if (!id && !name) {
      throw new Error('Either id or name must be provided');
    }

    let store;
    if (id) {
      store = await Store.findOne({ where: { id } });
    } else if (name) {
      store = await Store.findOne({ where: { name } });
    }

    return store;
  } catch (error) {
    throw new Error('Error finding store by id or name: ' + error.message);
  }
};

Store.updateByIdOrName = async ({ id, name }, store) => {
  try {
    if (!id && !name) {
      throw new Error('Either id or name must be provided');
    }

    let updatedStore;
    if (id) {
      updatedStore = await Store.update(
        { name: store.name, location: store.location },
        { where: { id }, returning: true }
      );
    } else if (name) {
      updatedStore = await Store.update(
        { name: store.name, location: store.location },
        { where: { name }, returning: true }
      );
    }

    if (updatedStore[0] === 0) {
      throw new Error('Store not found');
    }

    return updatedStore[1][0]; 
  } catch (error) {
    throw new Error('Error updating store: ' + error.message);
  }
};

Store.deleteByIdOrName = async ({ id, name }) => {
  try {
    if (!id && !name) {
      throw new Error('Either id or name must be provided');
    }

    let result;
    if (id) {
      result = await Store.destroy({ where: { id } });
    } else if (name) {
      result = await Store.destroy({ where: { name } });
    }

    if (result === 0) {
      throw new Error('Store not found');
    }

    return result;
  } catch (error) {
    throw new Error('Error deleting store: ' + error.message);
  }
};

module.exports = Store;
