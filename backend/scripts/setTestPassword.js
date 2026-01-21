#!/usr/bin/env node

/**
 * Script to set test user passwords for development
 * Usage: node scripts/setTestPassword.js
 */

require('dotenv').config();
const pool = require('../src/config/database');
const bcrypt = require('bcrypt');

async function setTestPasswords() {
  try {
    console.log('🔄 Setting test user passwords...\n');

    // Test credentials
    const testUsers = [
      {
        username: 'admin',
        password: 'Admin@123',
        description: 'Admin User'
      },
      {
        username: 'employee',
        password: 'Employee@123',
        description: 'Employee User'
      }
    ];

    for (const user of testUsers) {
      try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Update the user in database
        const query = `
          UPDATE users 
          SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
          WHERE username = $2
          RETURNING id, username, email
        `;
        
        const result = await pool.query(query, [hashedPassword, user.username]);

        if (result.rows.length > 0) {
          const updatedUser = result.rows[0];
          console.log(`✅ Updated ${user.description}:`);
          console.log(`   Username: ${user.username}`);
          console.log(`   Password: ${user.password}`);
          console.log(`   Email: ${updatedUser.email}\n`);
        } else {
          console.log(`⚠️  User '${user.username}' not found in database\n`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${user.username}:`, error.message);
      }
    }

    console.log('✨ Test password setup complete!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`\n${user.description}:`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Password: ${user.password}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run the script
setTestPasswords();
