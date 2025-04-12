// models/AuditLog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const AuditLog = sequelize.define('AuditLog', {
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
    type: DataTypes.ENUM('create', 'update', 'delete'),
    allowNull: false
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  changes: {
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
  timestamps: false
});

module.exports = AuditLog;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/database');

// const AuditLog = sequelize.define('AuditLog', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   action: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   table_name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   record_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   timestamp: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   tableName: 'auditlog',
//   timestamps: false
// });

// AuditLog.recordLog = async (logEntry) => {
//   return AuditLog.create(logEntry);
// };

// AuditLog.getLogs = async () => {
//   return AuditLog.findAll({ order: [['timestamp', 'DESC']] });
// };

// module.exports = AuditLog;
