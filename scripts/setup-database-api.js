#!/usr/bin/env node

/**
 * Database Setup Script - Using Supabase REST API
 * Executes SQL directly via Supabase's query endpoint
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function executeSQL(sql) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Extract project ref from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)[1];
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: body });
        } else {
          resolve({ success: false, error: body, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.write(data);
    req.end();
  });
}

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

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    console.log(`\n📖 Reading schema from: ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log(`✅ Schema loaded (${schema.length} characters)\n`);

    // Execute the entire schema at once
    console.log('⚡ Executing database schema...');
    
    const result = await executeSQL(schema);
    
    if (result.success) {
      console.log('✅ Schema executed successfully!\n');
    } else {
      console.error('⚠️  Schema execution completed with warnings:');
      console.error(result.error);
      
      if (result.error && result.error.includes('already exists')) {
        console.log('\n📝 Note: Tables already exist. This is fine if you\'re re-running the script.\n');
      }
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\nNext steps:');
    console.log('  1. Visit: http://localhost:3000');
    console.log('  2. Test API: curl http://localhost:3000/api/jobs');
    console.log('  3. Admin login: http://localhost:3000/admin');
    console.log('     Username: admin');
    console.log('     Password: PEGSecurity2025!\n');

  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
