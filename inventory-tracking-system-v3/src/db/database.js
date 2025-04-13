const { Sequelize } = require('sequelize');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'user123',
  database: process.env.DB_NAME || 'postgres'
};

let writeSequelize, readSequelize;

function setupDatabases() {
  if (!writeSequelize) { 
    writeSequelize = new Sequelize({
      dialect: 'postgres',
      ...DB_CONFIG,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 15, min: 5, acquire: 30000, idle: 10000 }
    });

    readSequelize = new Sequelize({
      dialect: 'postgres',
      ...DB_CONFIG,
      logging: false,
      pool: { max: 20, min: 5, acquire: 30000, idle: 10000 }
    });

    console.log('Database connections created (shared across workers)');
  }
}

async function testConnections() {
  try {
    await writeSequelize.authenticate();
    await readSequelize.authenticate();
    console.log('Database connections verified');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

setupDatabases();

module.exports = {
  setupDatabases,
  testConnections,
  get sequelize() { return writeSequelize; },
  get writeSequelize() { return writeSequelize; },
  get readSequelize() { return readSequelize; },
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost'
};
