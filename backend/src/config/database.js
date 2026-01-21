require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ess_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    logging: process.env.LOG_LEVEL === 'debug',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || 2),
      max: parseInt(process.env.DB_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  },
  testing: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ess_test',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    logging: false,
    pool: {
      min: 1,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false,
    ssl: true,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || 5),
      max: parseInt(process.env.DB_POOL_MAX || 20),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
    retryAttempts: 5,
    retryDelay: 1000,
  },
};

/**
 * Get current environment configuration
 * @returns {Object} Database configuration for current NODE_ENV
 */
module.exports.getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return module.exports[env] || module.exports.development;
};
