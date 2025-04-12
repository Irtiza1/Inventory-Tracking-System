const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  replication: {
    write: {
      host: process.env.DB_WRITE_HOST || 'localhost',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'user123',
      database: process.env.DB_NAME || 'postgres',
    },
    read: [
      {
        host: process.env.DB_READ_HOST_1 || 'localhost',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'user123',
        database: process.env.DB_NAME || 'postgres',
      },
      // Add more read replicas if needed
    ],
  },
  pool: {
    max: 10,
    idle: 10000,
    acquire: 30000,
  },
  logging: console.log,
  retry: {
    max: 3,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeTimeoutError/,
    ],
    backoffBase: 1000,
    backoffExponent: 1.5,
  },
});

sequelize.authenticate()
  .then(() => console.log('Sequelize Replicated DB Connected!'))
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });

module.exports = sequelize;


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
