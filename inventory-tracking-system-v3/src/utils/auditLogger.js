
// utils/auditLogger.js
const { publishToQueue } = require('./rabbitmq');
const redis = require('../db/redis');

let AuditLog; // Will be initialized after model definition

function initializeAuditLogger(auditLogModel) {
  AuditLog = auditLogModel;
}

async function logAction(modelName, action, recordId, data, options) {
  try {
    const logData = {
      model: modelName,
      action,
      record_id: recordId,
      ...data,
      user_id: options?.userId,
      ip_address: options?.requestIp,
      timestamp: new Date()
    };

    // Direct database logging
    if (AuditLog) {
      await AuditLog.create(logData);
    }
    
    // Async queue logging
    await publishToQueue('audit_logs', logData);
    
    // Cache recent logs
    if (redis.isReady) {
      await redis.zadd(
        `audit_logs:${modelName}:${recordId}`,
        Date.now(),
        JSON.stringify(logData)
      );
    }
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}

function addAuditHooks(sequelize, getCurrentUserId) {
  const models = sequelize.models;

  Object.keys(models).forEach(modelName => {
    const model = models[modelName];
    const tableName = model.getTableName();

    // Read logging
    model.addHook('afterFind', async (instances, options) => {
      if (!Array.isArray(instances)) instances = [instances];
      if (!instances || instances.length === 0) return;
      
      const userId = getCurrentUserId(options);
      await logAction(tableName, 'read', null, {
        records: instances.map(i => i.id),
        count: instances.length
      }, { ...options, userId });
    });

    // Create logging
    model.addHook('afterCreate', async (instance, options) => {
      const userId = getCurrentUserId(options);
      await logAction(tableName, 'create', instance.id, {
        new_data: instance.get({ plain: true })
      }, { ...options, userId });
    });

    // Update logging
    model.addHook('afterUpdate', async (instance, options) => {
      const userId = getCurrentUserId(options);
      const previousData = instance.previous();
      const changes = {};
      
      instance.changed().forEach(field => {
        changes[field] = {
          from: previousData[field],
          to: instance[field]
        };
      });

      await logAction(tableName, 'update', instance.id, {
        previous_data: changes,
        new_data: instance.get({ plain: true })
      }, { ...options, userId });
    });

    // Delete logging
    model.addHook('afterDestroy', async (instance, options) => {
      const userId = getCurrentUserId(options);
      await logAction(tableName, 'delete', instance.id, {
        previous_data: instance.get({ plain: true })
      }, { ...options, userId });
    });
  });
}

module.exports = {
  addAuditHooks,
  initializeAuditLogger,
  logAction
};


// const AuditLog = require('../models/AuditLogModel');
// const { publishToQueue } = require('./rabbitmq');
// const redis = require('../db/redis');

// function addAuditHooks(sequelize, getCurrentUserId) {
//   const models = sequelize.models;

//   Object.keys(models).forEach(modelName => {
//     const model = models[modelName];
//     const tableName = model.getTableName();

//     // Automatic read logging
//     model.addHook('afterFind', async (instances, options) => {
//       if (!Array.isArray(instances)) instances = [instances];
//       if (!instances || instances.length === 0) return;
      
//       const userId = getCurrentUserId(options);
//       const bulkLogs = instances.map(instance => ({
//         model: tableName,
//         action: 'read',
//         record_id: instance.id,
//         user_id: userId,
//         ip_address: options?.requestIp,
//         timestamp: new Date()
//       }));

//       // Async log via RabbitMQ
//       await publishToQueue('audit_logs_bulk', bulkLogs);
//     });

//     // Rest of the hooks (create, update, delete) remain similar but enhanced
//     // with Redis caching and RabbitMQ publishing as shown in the AuditLog model
//   });
// }

// module.exports = { addAuditHooks };



// function addAuditHooks(sequelize, getCurrentUserId) {
//   const models = sequelize.models;

//   Object.keys(models).forEach(modelName => {
//     const model = models[modelName];

//     model.addHook('beforeCreate', (instance, options) => {
//       const userId = getCurrentUserId(options);
//       if (userId) {
//         instance.set('createdBy', userId);
//         instance.set('updatedBy', userId);
//       }
//     });

//     model.addHook('beforeUpdate', (instance, options) => {
//       const userId = getCurrentUserId(options);
//       if (userId) {
//         instance.set('updatedBy', userId);
//       }
//     });

//     model.addHook('beforeDestroy', (instance, options) => {
//       const userId = getCurrentUserId(options);
//       if (userId && instance.set) {
//         instance.set('deletedBy', userId);
//         // Soft delete will trigger this
//       }
//     });
//   });
// }

// module.exports = { addAuditHooks };


// // utils/auditLogger.js

// function addAuditHooks(sequelize) {
//   const models = sequelize.models;

//   Object.keys(models).forEach(modelName => {
//     const model = models[modelName];

//     // Before Create Hook (can still use if needed)
//     model.addHook('beforeCreate', (instance, options) => {
//       // Nothing to do here since user tracking removed
//     });

//     // Before Update Hook
//     model.addHook('beforeUpdate', (instance, options) => {
//       // Nothing to do here
//     });

//     // Before Destroy Hook
//     model.addHook('beforeDestroy', (instance, options) => {
//       // Nothing to do here
//     });
//   });
// }

// module.exports = { addAuditHooks };

