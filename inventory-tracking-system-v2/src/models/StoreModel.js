// models/Store.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

// Define the Store model
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

// Sequelize-based methods

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

    return updatedStore[1][0]; // Returning the updated store object
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

    return result; // Returns the number of deleted rows (1 if successful)
  } catch (error) {
    throw new Error('Error deleting store: ' + error.message);
  }
};

module.exports = Store;

// second opt
// const db = require('../db/database');

// const Store = {
//   create: async (store, t = db) => {
//     return t.one(
//       `INSERT INTO Store (name, location)
//        VALUES ($1, $2) RETURNING *`,
//       [store.name, store.location]
//     );
//   },

//   findAll: async (t = db) => {
//     return t.any('SELECT * FROM Store');
//   },

//   findByIdOrName: async ({ id, name }, t = db) => {
//     if (!id && !name) {
//       throw new Error('Either id or name must be provided');
//     }
//     if (id) {
//       return t.oneOrNone('SELECT * FROM Store WHERE id = $1', [id]);
//     } else if (name) {
//       return t.oneOrNone('SELECT * FROM Store WHERE name = $1', [name]);
//     }
//     throw new Error('Either id or name must be provided');
//   },
  

//   updateByIdOrName: async ({ id, name }, store, t = db) => {
//     if (!id && !name) {
//       throw new Error('Either id or name must be provided');
//     }
  
//     // If you want to update by `id`
//     if (id) {
//       return t.oneOrNone(
//         `UPDATE Store SET name = $1, location = $2 WHERE id = $3 RETURNING *`,
//         [store.name, store.location, id]
//       );
//     }
  
//     // If you want to update by `name`
//     if (name) {
//       return t.oneOrNone(
//         `UPDATE Store SET name = $1, location = $2 WHERE name = $3 RETURNING *`,
//         [store.name, store.location, name]
//       );
//     }
//   },
  

//   deleteByIdOrName: async ({ id, name }, t = db) => {
//     if (!id && !name) {
//       throw new Error('Either id or name must be provided');
//     }
  
//     if (id) {
//       return t.result('DELETE FROM Store WHERE id = $1', [id], r => r.rowCount);
//     }
  
//     if (name) {
//       return t.result('DELETE FROM Store WHERE name = $1', [name], r => r.rowCount);
//     }
//   },
  
  
// };

// module.exports = Store;


// const db = require('../db/database');

// const Store = {
//   create: async (store) => {
//     return db.one(
//       `INSERT INTO Store (name, location)
//        VALUES ($1, $2) RETURNING *`,
//       [store.name, store.location]
//     );
//   },
//   findAll: async () => {
//     return db.any('SELECT * FROM Store');
//   },
//   findById: async (id) => {
//     return db.oneOrNone('SELECT * FROM Store WHERE id = $1', [id]);
//   },
//   update: async (id, store) => {
//     return db.oneOrNone(
//       `UPDATE Store SET name = $1, location = $2
//        WHERE id = $3 RETURNING *`,
//       [store.name, store.location, id]
//     );
//   },
//   delete: async (id) => {
//     return db.result('DELETE FROM Store WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = Store;
