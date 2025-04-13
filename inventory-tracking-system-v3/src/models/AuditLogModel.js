const { DataTypes } = require('sequelize');
const { writeSequelize } = require('../db/database');

const AuditLog = writeSequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('create', 'update', 'delete', 'restore', 'read'),
    allowNull: false
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  previous_data: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  new_data: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'audit_logs',
  timestamps: false,
  indexes: [
    { fields: ['model', 'record_id'] },
    { fields: ['timestamp'] }
  ]
});

module.exports = AuditLog;
