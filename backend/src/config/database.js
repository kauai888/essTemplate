require('dotenv').config();
const { Pool } = require('pg');

const configs = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ess_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    logging: process.env.LOG_LEVEL === 'debug',
    max: parseInt(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  testing: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ess_test',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    logging: false,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
    ssl: { rejectUnauthorized: false },
    max: parseInt(process.env.DB_POOL_MAX || 20),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
};

/**
 * Get current environment configuration
 * @returns {Object} Database configuration for current NODE_ENV
 */
const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
};

const pool = new Pool(getConfig());

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
module.exports.getConfig = getConfig;
module.exports.configs = configs;
