#!/usr/bin/env node

/**
 * Database Setup Script
 * Executes the complete schema from /supabase/schema.sql
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    console.log(`📖 Reading schema from: ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log(`✅ Schema loaded (${schema.length} characters)\n`);

    // Execute schema
    console.log('⚡ Executing database schema...');
    await client.query(schema);
    console.log('✅ Schema executed successfully!\n');

    // Verify tables created
    console.log('🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`\n✅ Database setup complete! Created ${result.rows.length} tables:\n`);
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

    console.log('\n🎉 Success! Your database is ready.');
    console.log('\nNext steps:');
    console.log('  1. Visit: http://localhost:3000');
    console.log('  2. Test API: curl http://localhost:3000/api/jobs');
    console.log('  3. Admin login: http://localhost:3000/admin');
    console.log('     Username: admin');
    console.log('     Password: PEGSecurity2025!\n');

  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);

    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Solution:');
      console.error('   1. Go to: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/settings/database');
      console.error('   2. Copy the connection string');
      console.error('   3. Update DATABASE_URL in .env.local');
    } else if (error.message.includes('already exists')) {
      console.log('\n⚠️  Tables already exist. This is fine if you\'re re-running the script.');
      console.log('   Schema uses CREATE TABLE IF NOT EXISTS, so it\'s safe to re-run.\n');
    }

    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the setup
setupDatabase();
