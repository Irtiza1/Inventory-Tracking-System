const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
db.connect()
  .then(obj => {
    console.log('✅ PostgreSQL Connected');
    obj.done(); // success, release the connection
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err.stack);
  });

module.exports = db;

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
