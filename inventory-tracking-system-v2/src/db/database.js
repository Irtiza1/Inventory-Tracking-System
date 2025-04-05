const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Sequelize setup for database connection
const sequelize = new Sequelize({
  dialect: 'postgres', 
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'user123',
  database: process.env.DB_NAME || 'postgres',
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
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

// Test connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize Connected');
    // Optionally sync models (for dev/testing purposes)
    // sequelize.sync({ force: false });
  })
  .catch((err) => {
    console.error('❌ Database Connection Error (Sequelize):');
    console.error(`Error Code: ${err.original.code}`);
    console.error(`Message: ${err.message}`);
    process.exit(1); // Exit process if connection fails
  });

// Export the sequelize instance
module.exports = sequelize;


// SECOND OPTION
//  const pgp = require('pg-promise')();
// require('dotenv').config();

// const db = pgp({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// // Test connection
// db.connect()
//   .then(obj => {
//     console.log('✅ PostgreSQL Connected');
//     obj.done(); // success, release the connection
//   })
//   .catch(err => {
//     console.error('❌ Database Connection Error:', err.stack);
//   });
  

// module.exports = db;

// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });
// // console.log('Connecting to:', process.env.DATABASE_URL);

// // Force test connection
// pool.connect()
//   .then(() => console.log('✅ PostgreSQL Connected'))
//   .catch((err) => console.error('❌ Database Connection Error:', err.stack));

// module.exports = {
//   query: (text, params) => pool.query(text, params),
//   pool,
// };
