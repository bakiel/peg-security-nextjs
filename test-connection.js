#!/usr/bin/env node

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function testConnection() {
  console.log('Testing database connection...\n');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Try with SSL
  });

  try {
    console.log('\nAttempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('Database Version:', result.rows[0].version);
    console.log('Current Database:', result.rows[0].current_database);
    console.log('Current User:', result.rows[0].current_user);
    
    console.log('\n✅ Connection test PASSED!');
  } catch (error) {
    console.error('❌ Connection test FAILED:');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await client.end();
  }
}

testConnection();
