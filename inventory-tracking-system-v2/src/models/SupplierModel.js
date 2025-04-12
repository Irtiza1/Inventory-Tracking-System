const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/database'); 

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'supplier',
  timestamps: false, 
  underscored: true, 
});

Supplier.associate = models => {
  Supplier.hasMany(models.Product, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
  Supplier.hasMany(models.UserAccount, { foreignKey: 'supplier_id', onDelete: 'SET NULL' });
};


Supplier.createSupplier = async (supplier) => {
  return Supplier.create({
    name: supplier.name,
    contact_info: supplier.contact_info
  });
};

Supplier.findAllSuppliers = async () => {
  return Supplier.findAll();
};

Supplier.findById = async (id) => {
  return Supplier.findOne({
    where: { id }
  });
};

Supplier.updateSupplier = async (id, supplier) => {
  const updatedSupplier = await Supplier.update(
    {
      name: supplier.name,
      contact_info: supplier.contact_info
    },
    {
      where: { id },
      returning: true, 
    }
  );
  return updatedSupplier[1][0]; 
};

Supplier.deleteSupplier = async (id) => {
  const deletedCount = await Supplier.destroy({
    where: { id }
  });
  return deletedCount; 
};

module.exports = Supplier;
