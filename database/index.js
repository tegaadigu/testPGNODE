const pool = require('./config');

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id BIGSERIAL PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        created TIMESTAMP,
        modified TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      pool.end();
    });
};

/**
 * Delete all records from table.
 */
const cleanUp = () => {
  const queryText = 'DELETE FROM users';
  pool.query(queryText)
    .then(() => {
      pool.end();
    })
    .catch((err) => {
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      pool.end();
    });
}

pool.on('remove', () => {
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
  cleanUp,
};


require('make-runnable');