const { Sequelize } = require('sequelize');
const Redis = require('ioredis');
const AMQP = require('amqplib');
require('dotenv').config();

module.exports = async () => {
  // Database Connections
  const db = {
    writer: new Sequelize(process.env.WRITE_DB_URL, {
      pool: {
        max: 20,  // Increased for write-heavy ops
        min: 3,
        acquire: 30000,
        idle: 10000
      },
      logging: false // Disable in production
    }),
    reader: new Sequelize(process.env.READ_DB_URL, {
      pool: {
        max: 30,  // More connections for reads
        min: 5,
        idle: 10000
      }
    })
  };

  // Redis Cache (Cluster ready)
  const redis = new Redis.Cluster([
    { host: process.env.REDIS_HOST, port: 6379 }
  ], {
    scaleReads: 'slave' // Distribute read load
  });

  // RabbitMQ (With retry logic)
  let channel;
  try {
    const conn = await AMQP.connect(process.env.AMQP_URL);
    channel = await conn.createChannel();
    await channel.assertExchange('inventory', 'topic', {
      durable: true,
      autoDelete: false
    });
  } catch (err) {
    console.error('AMQP Connection Failed - Retrying in 5s...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return module.exports(); // Retry
  }

  // Health Checks
  await Promise.all([
    db.writer.authenticate().then(() => console.log('Write DB OK')),
    db.reader.authenticate().then(() => console.log('Read DB OK')),
    redis.ping().then(() => console.log('Redis OK'))
  ]);

  return { ...db, redis, channel };
};


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
