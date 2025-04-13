const { publishToQueue } = require('./rabbitmq');
const redis = require('../db/redis');

let AuditLog; 
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

    if (AuditLog) {
      await AuditLog.create(logData);
    }
    
    await publishToQueue('audit_logs', logData);
    
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

    model.addHook('afterFind', async (instances, options) => {
      if (!Array.isArray(instances)) instances = [instances];
      if (!instances || instances.length === 0) return;
      
      const userId = getCurrentUserId(options);
      await logAction(tableName, 'read', null, {
        records: instances.map(i => i.id),
        count: instances.length
      }, { ...options, userId });
    });

    model.addHook('afterCreate', async (instance, options) => {
      const userId = getCurrentUserId(options);
      await logAction(tableName, 'create', instance.id, {
        new_data: instance.get({ plain: true })
      }, { ...options, userId });
    });

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

