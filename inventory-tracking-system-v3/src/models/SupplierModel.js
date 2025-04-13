const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');
const redis = require('../db/redis');
const { publishToQueue } = require('../utils/rabbitmq');

const Supplier = writeSequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
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
  tableName: 'suppliers',
  timestamps: false,
  underscored: true,
  paranoid: true,
  hooks: {
    afterCreate: async (supplier, options) => {
      await redis.set(`supplier:${supplier.id}`, JSON.stringify(supplier.toJSON()), 'EX', 3600);
      await publishToQueue('audit_logs', {
        model: 'Supplier',
        action: 'create',
        record_id: supplier.id,
        new_data: supplier.toJSON(),
        user_id: options?.userId,
        ip_address: options?.requestIp
      });
    },
    afterUpdate: async (supplier, options) => {
      await redis.set(`supplier:${supplier.id}`, JSON.stringify(supplier.toJSON()), 'EX', 3600);
      await redis.del('suppliers:all');
      
      const previousData = supplier.previous();
      const changes = {};
      supplier.changed().forEach(field => {
        changes[field] = {
          from: previousData[field],
          to: supplier[field]
        };
      });

      await publishToQueue('audit_logs', {
        model: 'Supplier',
        action: 'update',
        record_id: supplier.id,
        previous_data: changes,
        new_data: supplier.toJSON(),
        user_id: options?.userId,
        ip_address: options?.requestIp
      });
    },
    afterDestroy: async (supplier, options) => {
      await redis.del(`supplier:${supplier.id}`);
      await redis.del('suppliers:all');
      
      await publishToQueue('audit_logs', {
        model: 'Supplier',
        action: 'delete',
        record_id: supplier.id,
        previous_data: supplier.toJSON(),
        user_id: options?.userId,
        ip_address: options?.requestIp
      });
    }
  }
});

Supplier.createSupplier = async (supplierData, userId, options = {}) => {
  options.userId = userId;
  const supplier = await Supplier.create({
    ...supplierData,
    createdBy: userId,
    updatedBy: userId
  }, options);
  return supplier;
};

Supplier.findAllSuppliers = async (options = {}) => {
  const cached = await redis.get('suppliers:all');
  if (cached) return JSON.parse(cached);

  const suppliers = await Supplier.findAll(options);
  
  if (suppliers.length > 0) {
    await redis.set('suppliers:all', JSON.stringify(suppliers), 'EX', 300);
  }
  
  return suppliers;
};

Supplier.findById = async (id, options = {}) => {
  const cached = await redis.get(`supplier:${id}`);
  if (cached) return JSON.parse(cached);

  const supplier = await Supplier.findOne({
    where: { id },
    ...options
  });

  if (supplier) {
    await redis.set(`supplier:${id}`, JSON.stringify(supplier.toJSON()), 'EX', 3600);
  }
  
  return supplier;
};

Supplier.updateSupplier = async (id, supplierData, userId, options = {}) => {
  options.userId = userId;
  const [affectedCount, [updatedSupplier]] = await Supplier.update(
    {
      ...supplierData,
      updatedBy: userId
    },
    {
      where: { id },
      returning: true,
      individualHooks: true,
      ...options
    }
  );
  return updatedSupplier;
};

Supplier.deleteSupplier = async (id, userId, options = {}) => {
  options.userId = userId;
  
  await Supplier.update(
    { deletedBy: userId },
    { where: { id }, ...options }
  );
  
  const result = await Supplier.destroy({
    where: { id },
    ...options
  });
  
  return result;
};

// Associations
// Supplier.associate = models => {
//   Supplier.hasMany(models.Product, { 
//     foreignKey: 'supplier_id', 
//     as: 'products',
//     onDelete: 'SET NULL' 
//   });
  
//   Supplier.hasMany(models.UserAccount, { 
//     foreignKey: 'supplier_id', 
//     as: 'userAccounts',
//     onDelete: 'SET NULL' 
//   });
// };

module.exports = Supplier;
