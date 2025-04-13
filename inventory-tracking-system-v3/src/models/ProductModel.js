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


Product.createProduct = async (productData, userId) => {
  const product = await Product.create({
    ...productData,
    createdBy: userId,
    updatedBy: userId
  });
  
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
  
  await redis.set(`product:${productCode}`, JSON.stringify(updatedProduct.toJSON()), 'EX', 3600);
  await redis.del('products:all');
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
  
  await redis.del(`product:${productCode}`);
  await redis.del('products:all');
  
  return result;
};

Product.findAllProducts = async (options = {}) => {
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
  
  await redis.set('products:all', JSON.stringify(products), 'EX', 300);
  
  return products;
};

Product.findBy 
ProductCode = async (code, options = {}) => {
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

