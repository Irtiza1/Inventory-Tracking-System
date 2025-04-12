const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database'); 
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
    attributes: ['id'],  
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
      returning: true, 
    }
  );
  return updatedProduct[1][0]; 
};

Product.deleteProduct = async (productcode) => {
  const deletedCount = await Product.destroy({
    where: { product_code: productcode },
  });
  return deletedCount; 
};

module.exports = Product;
