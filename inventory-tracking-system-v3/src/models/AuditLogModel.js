// models/AuditLog.js
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
  // ip_address: {
  //   type: DataTypes.STRING,
  //   allowNull: true
  // },
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


/*
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const redis = require('../db/redis');
const { publishToQueue } = require('../utils/rabbitmq');

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
  // ip_address: {
  //   type: DataTypes.STRING,
  //   allowNull: true
  // },
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
  ],
  hooks: {
    afterCreate: async (log) => {
      // Cache recent logs in Redis
      await redis.zadd(`audit_logs:${log.model}:${log.record_id}`, 
        Date.now(), 
        JSON.stringify(log.toJSON())
      );
      // Publish to RabbitMQ for async processing
      await publishToQueue('audit_logs', log.toJSON());
    }
  }
});

// Class method to get cached logs
AuditLog.getCachedLogs = async (model, recordId, limit = 10) => {
  const logs = await redis.zrevrange(
    `audit_logs:${model}:${recordId}`, 
    0, 
    limit - 1
  );
  return logs.map(JSON.parse);
};

module.exports = AuditLog;
*/


// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/database');

// const AuditLog = sequelize.define('AuditLog', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   model: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   action: {
//     type: DataTypes.ENUM('create', 'update', 'delete'),
//     allowNull: false
//   },
//   record_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   changes: {
//     type: DataTypes.JSONB,
//     allowNull: true
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   timestamp: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   tableName: 'audit_logs',
//   timestamps: false
// });

// module.exports = AuditLog;








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
