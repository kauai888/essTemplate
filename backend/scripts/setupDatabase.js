#!/usr/bin/env node

/**
 * Database Setup Script
 * Creates and seeds the PostgreSQL database
 * Usage: node scripts/setupDatabase.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Create a connection to the default postgres database (to create ess_db)
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || 5432),
  database: 'postgres', // Connect to default database
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Create a connection to the ess_db database (for seeding)
const dbPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'ess_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function setupDatabase() {
  let client;
  try {
    console.log('🚀 Starting database setup...\n');

    // Step 1: Create database
    console.log('📦 Step 1: Creating database...');
    client = await adminPool.connect();
    
    try {
      await client.query(`CREATE DATABASE ess_db`);
      console.log('✅ Database created\n');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('✅ Database already exists\n');
      } else {
        throw err;
      }
    }
    
    client.release();

    // Step 2: Read and execute ess_db.sql
    console.log('📊 Step 2: Creating tables and schema...');
    const essSqlPath = path.join(__dirname, '../../ess_db.sql');
    
    if (!fs.existsSync(essSqlPath)) {
      console.error('❌ Error: ess_db.sql not found at', essSqlPath);
      process.exit(1);
    }

    const essSql = fs.readFileSync(essSqlPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = essSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    let count = 0;
    for (const statement of statements) {
      try {
        await dbPool.query(statement);
        count++;
      } catch (err) {
        // Some statements might fail (like CREATE EXTENSION IF NOT EXISTS)
        // We'll log but continue
        if (!err.message.includes('already exists') && !err.message.includes('EXTENSION')) {
          console.warn(`⚠️  Warning on statement ${count}:`, err.message);
        }
      }
    }
    console.log(`✅ Schema created (${count} statements executed)\n`);

    // Step 3: Read and execute admin.sql
    console.log('👤 Step 3: Seeding test data...');
    const adminSqlPath = path.join(__dirname, '../../admin.sql');
    
    if (!fs.existsSync(adminSqlPath)) {
      console.error('❌ Error: admin.sql not found at', adminSqlPath);
      process.exit(1);
    }

    const adminSql = fs.readFileSync(adminSqlPath, 'utf8');
    
    // Check if test user already exists
    const checkResult = await dbPool.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );

    if (checkResult.rows.length === 0) {
      const adminStatements = adminSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of adminStatements) {
        try {
          await dbPool.query(statement);
        } catch (err) {
          console.warn('⚠️  Warning:', err.message);
        }
      }
      console.log('✅ Test data seeded\n');
    } else {
      console.log('✅ Test data already exists\n');
    }

    // Step 4: Verify tables exist
    console.log('🔍 Step 4: Verifying tables...');
    const tables = [
      'users',
      'otp_sessions',
      'auth_tokens',
      'attendance_records',
      'leave_balance',
      'leave_requests',
      'announcements',
      'audit_logs',
      'departments',
      'shifts',
      'employee_shifts',
      'geofences',
      'system_settings'
    ];

    const result = await dbPool.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public'`
    );

    const existingTables = result.rows.map(r => r.table_name);
    let tablesOk = 0;
    
    for (const table of tables) {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
        tablesOk++;
      } else {
        console.log(`  ❌ ${table}`);
      }
    }

    console.log(`\n${tablesOk}/${tables.length} tables exist\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Database setup complete!\n');
    console.log('📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Account:');
    console.log('  Username: admin');
    console.log('  Password: Admin@123');
    console.log('  Email: admin@company.com\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 Next steps:');
    console.log('  1. Make sure backend is running: npm run dev');
    console.log('  2. Go to http://localhost:3001/login');
    console.log('  3. Login with credentials above');
    console.log('  4. Test the application\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check .env file has correct DB credentials');
    console.error('3. Verify database user exists and has permissions');
    console.error('4. Try creating the database manually first:\n');
    console.error('   CREATE DATABASE ess_db;');
    process.exit(1);
  } finally {
    await adminPool.end();
    await dbPool.end();
  }
}

// Run the setup
setupDatabase();
