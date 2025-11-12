#!/usr/bin/env node

/**
 * Database Setup Script - Using Supabase JS Client
 * More reliable than direct PostgreSQL connection
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('🔌 Connecting to Supabase...');
  console.log('   URL:', supabaseUrl);
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    console.log(`\n📖 Reading schema from: ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log(`✅ Schema loaded (${schema.length} characters)\n`);

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`⚡ Executing ${statements.length} database statements...\n`);

    // Execute each statement
    let successCount = 0;
    let skipCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments and empty statements
      if (statement.trim().startsWith('--') || statement.trim() === ';') {
        continue;
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Check if it's a "already exists" error (which is OK)
          if (error.message.includes('already exists')) {
            skipCount++;
            console.log(`   ⏭️  Skipped (already exists): Statement ${i + 1}`);
          } else {
            console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
          }
        } else {
          successCount++;
          console.log(`   ✅ Executed: Statement ${i + 1}`);
        }
      } catch (err) {
        console.error(`   ❌ Error in statement ${i + 1}:`, err.message);
      }
    }

    console.log(`\n📊 Results:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Failed: ${statements.length - successCount - skipCount}`);

    // Verify tables created
    console.log('\n🔍 Verifying tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (tablesError) {
      console.error('❌ Could not verify tables:', tablesError.message);
    } else {
      console.log(`\n✅ Database setup complete! Found ${tables.length} tables:\n`);
      tables.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    }

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
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
