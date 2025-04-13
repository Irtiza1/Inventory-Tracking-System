const { DataTypes } = require('sequelize');
const { readSequelize, writeSequelize } = require('../db/database');
const redis = require('../db/redis');
const { publishToQueue } = require('../utils/rabbitmq');
const Supplier = require('./SupplierModel');
const Product = writeSequelize.define('Product', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  product_code: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  current_quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  supplier_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: Supplier,
      key: 'id'
    }
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_at: { 
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
  },
}, {
  tableName: 'products',
  timestamps: false,
  underscored: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ['deletedBy'] }
  },
  scopes: {
    withDeleted: {
      paranoid: false
    }
  }
});

// Read replica model
const ProductRead = readSequelize.define('Product', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  product_code: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  current_quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  supplier_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: Supplier,
      key: 'id'
    }
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_at: { 
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
  },
}, {
  tableName: 'products',
  timestamps: false,
  underscored: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ['deletedBy'] }
  }
});

// ========== Methods with Read/Write Separation ==========

Product.createProduct = async (productData, userId) => {
  const product = await Product.create({
    ...productData,
    createdBy: userId,
    updatedBy: userId
  });
  
  // Cache in Redis
  await redis.set(`product:${product.product_code}`, JSON.stringify(product.toJSON()), 'EX', 3600);
  
  return product;
};

Product.updateProduct = async (productCode, productData, userId) => {
  const [affectedCount, [updatedProduct]] = await Product.update(
    {
      ...productData,
      updated_at: writeSequelize.fn('NOW'),
      updatedBy: userId
    },
    {
      where: { product_code: productCode },
      returning: true,
      individualHooks: true
    }
  );
  
  // Update cache
  await redis.set(`product:${productCode}`, JSON.stringify(updatedProduct.toJSON()), 'EX', 3600);
  await redis.del('products:all'); // Invalidate list cache
  
  return updatedProduct;
};

Product.deleteProduct = async (productCode, userId) => {
  await Product.update(
    { deletedBy: userId },
    { where: { product_code: productCode } }
  );
  
  const result = await Product.destroy({ 
    where: { product_code: productCode } 
  });
  
  // Clear cache
  await redis.del(`product:${productCode}`);
  await redis.del('products:all');
  
  return result;
};

// Read operations use read replica and Redis caching
Product.findAllProducts = async (options = {}) => {
  // Try cache first
  const cached = await redis.get('products:all');
  if (cached) return JSON.parse(cached);
  
  const products = await ProductRead.findAll({
    ...options,
    include: [{
      model: Supplier,
      as: 'supplier',
      attributes: ['id', 'name']
    }]
  });
  
  // Cache result
  await redis.set('products:all', JSON.stringify(products), 'EX', 300);
  
  return products;
};

Product.findByProductCode = async (code, options = {}) => {
  // Try cache first
  const cached = await redis.get(`product:${code}`);
  if (cached) return JSON.parse(cached);
  
  const product = await ProductRead.findOne({ 
    where: { product_code: code },
    include: [{
      model: Supplier,
      as: 'supplier',
      attributes: ['id', 'name']
    }],
    ...options
  });
  
  if (product) {
    await redis.set(`product:${code}`, JSON.stringify(product.toJSON()), 'EX', 3600);
  }
  
  return product;
};

Product.findBySupplierId = async (sid) => Product.findAll({ where: { supplier_id: sid } });
Product.getIdByProductCode = async (code) => {
  const p = await Product.findOne({ attributes: ['id'], where: { product_code: code } });
  return p ? p.id : null;
};
module.exports = Product;
// ... other methods with similar read/write separation ...



// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../db/database');
// const Supplier = require('./SupplierModel');

// const Product = sequelize.define('Product', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, allowNull: false },
//   product_code: { type: DataTypes.STRING, unique: true, allowNull: false },
//   price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
//   initial_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
//   supplier_id: { type: DataTypes.INTEGER, allowNull: true },
//   created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   createdBy: DataTypes.INTEGER,
//   updatedBy: DataTypes.INTEGER,
//   deletedBy: DataTypes.INTEGER,
// }, {
//   tableName: 'product',
//   timestamps: false,
//   underscored: true,
//   paranoid: true,
// });

// Product.belongsTo(Supplier, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });

// // ========== Methods ==========

// Product.createProduct = async (product, userId) => {
//   return Product.create({
//     name: product.name,
//     product_code: product.product_code,
//     price: product.price,
//     initial_quantity: product.initial_quantity,
//     supplier_id: product.supplier_id,
//     createdBy: userId,
//     updatedBy: userId
//   });
// };

// Product.updateProduct = async (oldProductCode, product, userId) => {
//   const updatedProduct = await Product.update(
//     {
//       name: product.name,
//       product_code: product.product_code,
//       price: product.price,
//       initial_quantity: product.initial_quantity,
//       supplier_id: product.supplier_id,
//       updated_at: sequelize.fn('CURRENT_TIMESTAMP'),
//       updatedBy: userId
//     },
//     {
//       where: { product_code: oldproductcode },
//       returning: true,
//     }
//   );
//   return updatedProduct[1][0];
// };


// Product.deleteProduct = async (productcode, userId) => {
//   await Product.update(
//     { deletedBy: userId },
//     { where: { product_code: productcode } }
//   );
//   return Product.destroy({ where: { product_code: productcode } });
// };
// // Other unchanged methods...
// Product.findAllProducts = async () => Product.findAll();
// Product.findByProductCode = async (code) => Product.findOne({ where: { product_code: code } });
// Product.findBySupplierId = async (sid) => Product.findAll({ where: { supplier_id: sid } });
// Product.getIdByProductCode = async (code) => {
//   const p = await Product.findOne({ attributes: ['id'], where: { product_code: code } });
//   return p ? p.id : null;
// };

// module.exports = Product;


// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../db/database'); 
// const Supplier = require('./SupplierModel'); 
// const Product = sequelize.define('Product', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   product_code: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   initial_quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   },
//   supplier_id: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   createdBy: DataTypes.INTEGER,
//   updatedBy: DataTypes.INTEGER,
//   deletedBy: DataTypes.INTEGER,
// }, {
//   tableName: 'product',
//   timestamps: false,
//   underscored: true,
//   paranoid: true

// });

// Product.belongsTo(Supplier, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });


// Product.createProduct = async (product) => {
//   return Product.create({
//     name: product.name,
//     product_code: product.product_code,
//     price: product.price,
//     initial_quantity: product.initial_quantity,
//     supplier_id: product.supplier_id,
//   });
// };

// Product.findAllProducts = async () => {
//   return Product.findAll();
// };

// Product.findByProductCode = async (productcode) => {
//   return Product.findOne({
//     where: { product_code: productcode },
//   });
// };

// Product.findBySupplierId = async (supplierid) => {
//   return Product.findAll({
//     where: { supplier_id: supplierid },
//   });
// };

// Product.getIdByProductCode = async (productcode) => {
//   const product = await Product.findOne({
//     attributes: ['id'],  
//     where: { product_code: productcode },
//   });
//   return product ? product.id : null;
// };

// Product.updateProduct = async (oldproductcode, product) => {
//   const updatedProduct = await Product.update(
//     {
//       name: product.name,
//       product_code: product.product_code,
//       price: product.price,
//       initial_quantity: product.initial_quantity,
//       supplier_id: product.supplier_id,
//       updated_at: sequelize.fn('CURRENT_TIMESTAMP'),
//     },
//     {
//       where: { product_code: oldproductcode },
//       returning: true, 
//     }
//   );
//   return updatedProduct[1][0]; 
// };

// Product.deleteProduct = async (productcode) => {
//   const deletedCount = await Product.destroy({
//     where: { product_code: productcode },
//   });
//   return deletedCount; 
// };

// module.exports = Product;
