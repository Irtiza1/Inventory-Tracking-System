const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming sequelize instance is configured
const Supplier = require('../models/SupplierModel'); 
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  initial_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'product',
  timestamps: false,
  underscored: true
});

// Define the relationship to Supplier
Product.belongsTo(Supplier, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });


Product.createProduct = async (product) => {
  return Product.create({
    name: product.name,
    product_code: product.product_code,
    price: product.price,
    initial_quantity: product.initial_quantity,
    supplier_id: product.supplier_id,
  });
};

Product.findAllProducts = async () => {
  return Product.findAll();
};

Product.findByProductCode = async (productcode) => {
  return Product.findOne({
    where: { product_code: productcode },
  });
};

Product.findBySupplierId = async (supplierid) => {
  return Product.findAll({
    where: { supplier_id: supplierid },
  });
};

Product.getIdByProductCode = async (productcode) => {
  const product = await Product.findOne({
    attributes: ['id'],  // Only get the 'id' field
    where: { product_code: productcode },
  });
  return product ? product.id : null;
};

Product.updateProduct = async (oldproductcode, product) => {
  const updatedProduct = await Product.update(
    {
      name: product.name,
      product_code: product.product_code,
      price: product.price,
      initial_quantity: product.initial_quantity,
      supplier_id: product.supplier_id,
      updated_at: sequelize.fn('CURRENT_TIMESTAMP'),
    },
    {
      where: { product_code: oldproductcode },
      returning: true, // To return the updated product
    }
  );
  return updatedProduct[1][0]; // Return the updated product from the result
};

Product.deleteProduct = async (productcode) => {
  const deletedCount = await Product.destroy({
    where: { product_code: productcode },
  });
  return deletedCount; // Returns the number of rows affected (deleted)
};

module.exports = Product;



// second option
//  const db = require('../db/database');

// const Product = {
//   create: async (product, t = db) => {
//     return t.one(
//       `INSERT INTO Product (name, product_code, price, initial_quantity, supplier_id)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [product.name, product.product_code, product.price, product.initial_quantity, product.supplier_id]
//     );
//   },

//   findAll: async (t = db) => {
//     return t.any('SELECT * FROM Product');
//   },

//   findByProductCode: async (productcode, t = db) => {
//     return t.oneOrNone('SELECT * FROM Product WHERE product_code = $1', [productcode]);
//   },
//   findBySupplierId: async (supplierid, t = db) => {
//     return t.oneOrNone('SELECT * FROM Product WHERE supplier_id = $1', [supplierid]);
//   },
//   getIdByProductCode: async(productcode, t = db) => {
//     return t.oneOrNone('SELECT id FROM Product WHERE product_code = $1', [productcode]);
//   },
//   update: async (oldproductcode, product, t = db) => {
//     return t.oneOrNone(
//       `UPDATE Product
//        SET name = $1, product_code = $2, price = $3, initial_quantity = $4, supplier_id = $5, updated_at = CURRENT_TIMESTAMP
//        WHERE product_code = $6
//        RETURNING *`,
//       [product.name, product.product_code, product.price, product.initial_quantity, product.supplier_id, oldproductcode]
//     );
//   },

//   delete: async (productcode, t = db) => {
//     return t.result('DELETE FROM Product WHERE product_code = $1', [productcode], r => r.rowCount);
//   },
// };

// module.exports = Product;


// const db = require('../db/database');
// const Product = {
//   create: async (product) => {
//     return db.one(
//       `INSERT INTO Product (name, product_code, price, initial_quantity, supplier_id)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [product.name, product.product_code, product.price, product.initial_quantity, product.supplier_id]
//     );
//   },
//   findAll: async () => {
//     return db.any('SELECT * FROM Product');
//   },
//   findById: async (id) => {
//     return db.oneOrNone('SELECT * FROM Product WHERE id = $1', [id]);
//   },
//   update: async (id, product) => {
//     return db.oneOrNone(
//       `UPDATE Product SET name = $1, product_code = $2, price = $3, initial_quantity = $4, supplier_id = $5, updated_at = CURRENT_TIMESTAMP
//        WHERE id = $6 RETURNING *`,
//       [product.name, product.product_code, product.price, product.initial_quantity, product.supplier_id, id]
//     );
//   },
//   delete: async (id) => {
//     return db.result('DELETE FROM Product WHERE id = $1', [id], r => r.rowCount);
//   },
// };

// module.exports = Product;



// const db = require("../db/database");

// const ProductModel = {
//     // Create a new product
//     create: async (name, productCode, price, initialQuantity) => {
//         const sql = `INSERT INTO product (name, product_code, price, initial_quantity, available_quantity) 
//                      VALUES (?, ?, ?, ?, ?)`;
//         return new Promise((resolve, reject) => {
//             db.run(sql, [name, productCode, price, initialQuantity, initialQuantity], 
//                 function (err) {
//                     err ? reject(err) : resolve(this.lastID);
//                 }
//             );
//         });
//     },

//     // Get all products
//     getAll: async () => {
//         return new Promise((resolve, reject) => {
//             db.all("SELECT * FROM product", [], (err, rows) => {
//                 err ? reject(err) : resolve(rows);
//             });
//         });
//     },

//     // Get product by ID
//     getById: async (id) => {
//         return new Promise((resolve, reject) => {
//             db.get("SELECT * FROM product WHERE id = ?", [id], (err, row) => {
//                 err ? reject(err) : resolve(row);
//             });
//         });
//     },

//     // Update stock (atomic operation)
//     updateStock: async (productId, quantity) => {
//         return new Promise((resolve, reject) => {
//             const sql = `UPDATE product 
//                          SET available_quantity = available_quantity + ? 
//                          WHERE id = ?`;
//             db.run(sql, [quantity, productId], function (err) {
//                 err ? reject(err) : resolve(this.changes);
//             });
//         });
//     },

//     // Get current stock
//     getCurrentStock: async (productId) => {
//         return new Promise((resolve, reject) => {
//             db.get("SELECT available_quantity FROM product WHERE id = ?", 
//                 [productId], 
//                 (err, row) => {
//                     err ? reject(err) : resolve(row?.available_quantity);
//                 }
//             );
//         });
//     }
// };

// module.exports = ProductModel;
