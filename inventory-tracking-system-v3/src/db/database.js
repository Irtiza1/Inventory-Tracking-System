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

// const { Sequelize } = require('sequelize');

// // Use environment variables or fallback to defaults
// const DB_CONFIG = {
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT || 5432,
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'user123',
//   database: process.env.DB_NAME || 'postgres'
// };

// const writeSequelize = new Sequelize({
//   dialect: 'postgres',
//   ...DB_CONFIG,
//   logging: process.env.NODE_ENV === 'development' ? console.log : false,
//   pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
// });

// const readSequelize = new Sequelize({
//   dialect: 'postgres',
//   ...DB_CONFIG,
//   logging: false,
//   pool: { max: 20, min: 0, acquire: 30000, idle: 10000 }
// });

// // Test connections
// (async () => {
//   try {
//     await writeSequelize.authenticate();
//     console.log('Write connection established');
//     await readSequelize.authenticate();
//     console.log('Read connection established');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1); // Exit if connection fails
//   }
// })();

// module.exports = {
//   sequelize: writeSequelize,
//   writeSequelize,
//   readSequelize,
//   Sequelize,
//   REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
//   RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost'
// };





// const { Sequelize } = require('sequelize');

// const DB_WRITE_URL = process.env.DB_WRITE_URL || 'postgres://user:password@localhost:5432/postgres';
// const DB_READ_URL = process.env.DB_READ_URL || DB_WRITE_URL;

// const writeSequelize = new Sequelize(DB_WRITE_URL, {
//   dialect: 'postgres',
//   logging: process.env.NODE_ENV === 'development' ? console.log : false,
//   pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
// });

// const readSequelize = new Sequelize(DB_READ_URL, {
//   dialect: 'postgres',
//   logging: false,
//   pool: { max: 20, min: 0, acquire: 30000, idle: 10000 }
// });

// // Test connections
// (async () => {
//   try {
//     await writeSequelize.authenticate();
//     console.log('Write connection established');
//     await readSequelize.authenticate();
//     console.log('Read connection established');
//   } catch (error) {
//     console.error('Database connection error:', error);
//   }
// })();

// module.exports = {
//   sequelize: writeSequelize, // default export for backward compatibility
//   writeSequelize,           // explicit write connection
//   readSequelize,            // explicit read connection
//   Sequelize,                // export Sequelize class for model definitions
//   REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
//   RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost'
// };

// code 1
// const { Sequelize } = require('sequelize');
// const Redis = require('ioredis');
// const AMQP = require('amqplib');
// require('dotenv').config();

// module.exports = async () => {
//   // Database Connections
//   const db = {
//     writer: new Sequelize(process.env.WRITE_DB_URL, {
//       pool: {
//         max: 20,  // Increased for write-heavy ops
//         min: 3,
//         acquire: 30000,
//         idle: 10000
//       },
//       logging: false // Disable in production
//     }),
//     reader: new Sequelize(process.env.READ_DB_URL, {
//       pool: {
//         max: 30,  // More connections for reads
//         min: 5,
//         idle: 10000
//       }
//     })
//   };

//   // Redis Cache (Cluster ready)
//   const redis = new Redis.Cluster([
//     { host: process.env.REDIS_HOST, port: 6379 }
//   ], {
//     scaleReads: 'slave' // Distribute read load
//   });

//   // RabbitMQ (With retry logic)
//   let channel;
//   try {
//     const conn = await AMQP.connect(process.env.AMQP_URL);
//     channel = await conn.createChannel();
//     await channel.assertExchange('inventory', 'topic', {
//       durable: true,
//       autoDelete: false
//     });
//   } catch (err) {
//     console.error('AMQP Connection Failed - Retrying in 5s...');
//     await new Promise(resolve => setTimeout(resolve, 5000));
//     return module.exports(); // Retry
//   }

//   // Health Checks
//   await Promise.all([
//     db.writer.authenticate().then(() => console.log('Write DB OK')),
//     db.reader.authenticate().then(() => console.log('Read DB OK')),
//     redis.ping().then(() => console.log('Redis OK'))
//   ]);

//   return { ...db, redis, channel };
// };

// code 2
// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   replication: {
//     write: {
//       host: process.env.DB_WRITE_HOST || 'localhost',
//       username: process.env.DB_USER || 'postgres',
//       password: process.env.DB_PASSWORD || 'user123',
//       database: process.env.DB_NAME || 'postgres',
//     },
//     read: [
//       {
//         host: process.env.DB_READ_HOST_1 || 'localhost',
//         username: process.env.DB_USER || 'postgres',
//         password: process.env.DB_PASSWORD || 'user123',
//         database: process.env.DB_NAME || 'postgres',
//       },
//       // Add more read replicas if needed
//     ],
//   },
//   pool: {
//     max: 10,
//     idle: 10000,
//     acquire: 30000,
//   },
//   logging: console.log,
//   retry: {
//     max: 3,
//     match: [
//       /SequelizeConnectionError/,
//       /SequelizeConnectionRefusedError/,
//       /SequelizeTimeoutError/,
//     ],
//     backoffBase: 1000,
//     backoffExponent: 1.5,
//   },
// });

// sequelize.authenticate()
//   .then(() => console.log('Sequelize Replicated DB Connected!'))
//   .catch((err) => {
//     console.error('Failed to connect to DB:', err);
//     process.exit(1);
//   });

// module.exports = sequelize;


// code 3
// const { Sequelize, DataTypes } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize({
//   dialect: 'postgres', 
//   host: process.env.DB_HOST || 'localhost',
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'user123',
//   database: process.env.DB_NAME || 'postgres',
//   logging: true,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   retry: {
//     max: 3,
//     match: [
//       /SequelizeConnectionError/,
//       /SequelizeConnectionRefusedError/,
//       /SequelizeTimeoutError/,
//     ],
//     backoffBase: 1000,
//     backoffExponent: 1.5,
//   },
// });

// sequelize.authenticate()
//   .then(() => {
//     console.log('Sequelize Connected');
//   })
//   .catch((err) => {
//     console.error('Database Connection Error (Sequelize):');
//     console.error(`Error Code: ${err.original.code}`);
//     console.error(`Message: ${err.message}`);
//     process.exit(1); 
//   });

// module.exports = sequelize;
