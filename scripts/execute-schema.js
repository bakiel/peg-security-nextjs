#!/usr/bin/env node

/**
 * Execute Database Schema
 *
 * This script executes the complete database schema from supabase/schema.sql
 * using the postgres library for direct PostgreSQL connection.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Try different connection methods
const databaseUrl = process.env.DATABASE_URL_DIRECT ||
                    process.env.DATABASE_URL ||
                    'postgresql://postgres.ujiaeiqslzwmpvkyixdp:tLG35lx2JoV2Zk7H@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

console.log('Using connection:', databaseUrl.replace(/:([^:@]+)@/, ':***@'));

if (!databaseUrl) {
  console.error('❌ Error: Missing DATABASE_URL in .env.local');
  process.exit(1);
}

async function executeSchema() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('📋 Reading schema file...');
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Remove comments and split by semicolons
    const statements = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📦 Found ${statements.length} SQL statements\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Determine statement type for logging
      let statementType = 'Unknown';
      if (statement.startsWith('CREATE TABLE')) statementType = 'CREATE TABLE';
      else if (statement.startsWith('CREATE INDEX')) statementType = 'CREATE INDEX';
      else if (statement.startsWith('CREATE OR REPLACE FUNCTION')) statementType = 'CREATE FUNCTION';
      else if (statement.startsWith('CREATE TRIGGER')) statementType = 'CREATE TRIGGER';
      else if (statement.startsWith('ALTER TABLE')) statementType = 'ALTER TABLE';
      else if (statement.startsWith('CREATE POLICY')) statementType = 'CREATE POLICY';
      else if (statement.startsWith('INSERT INTO')) statementType = 'INSERT DATA';

      // Extract table/object name
      const nameMatch = statement.match(/(?:TABLE|INDEX|FUNCTION|TRIGGER|POLICY)\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"[^"]+"|[^\s(]+)/i);
      const objectName = nameMatch ? nameMatch[0].split(/\s+/).pop().replace(/"/g, '') : '';

      process.stdout.write(`[${i + 1}/${statements.length}] ${statementType} ${objectName}... `);

      try {
        await client.query(statement);
        console.log('✅');
        successCount++;
      } catch (err) {
        console.log('❌');
        console.error(`    Error: ${err.message}`);
        errorCount++;

        // Continue with next statement unless it's a critical error
        if (err.message.includes('already exists')) {
          console.log('    (Object already exists, continuing...)\n');
        } else {
          console.log(`    Statement: ${statement.substring(0, 100)}...\n`);
        }
      }
    }

    console.log(`\n📊 Execution Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);

    // Verify tables
    console.log('\n🔍 Verifying tables...');

    const { rows: tables } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('\n✅ Tables in database:');
    tables.forEach(table => {
      console.log(`   • ${table.table_name}`);
    });

    console.log('\n✨ Schema execution completed!\n');

  } catch (err) {
    console.error('\n💥 Fatal error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Execute
executeSchema();
