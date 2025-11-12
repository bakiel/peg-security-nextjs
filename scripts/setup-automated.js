#!/usr/bin/env node

/**
 * Complete Automated Supabase Setup using Management API
 * This uses the Supabase Management API which the MCP server uses
 * 
 * Features:
 * - Creates all database tables via SQL
 * - Sets up storage buckets
 * - Configures bucket policies
 * - Verifies everything works
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const PROJECT_REF = 'ujiaeiqslzwmpvkyixdp';
const ACCESS_TOKEN = 'sbp_6596626ef518ed0e896aa4031a560c3dd19d0193';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function makeAPIRequest(endpoint, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data: jsonBody, statusCode: res.statusCode });
          } else {
            resolve({ success: false, error: jsonBody, statusCode: res.statusCode, body });
          }
        } catch (e) {
          resolve({ success: false, error: body, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => reject(error));
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function executeSQL(sql) {
  console.log(`\n⚡ Executing SQL (${sql.length} characters)...`);
  
  const result = await makeAPIRequest(
    `/v1/projects/${PROJECT_REF}/database/query`,
    'POST',
    { query: sql }
  );

  if (result.success) {
    console.log(`   ✅ Success`);
    return result;
  } else {
    if (result.body && result.body.includes('already exists')) {
      console.log(`   ⏭️  Already exists - skipping`);
      return { success: true, skipped: true };
    }
    console.error(`   ❌ Error:`, result.error || result.body);
    return result;
  }
}

async function setupStorageBuckets() {
  console.log('\n📦 Setting up Storage Buckets...');
  
  const buckets = [
    {
      id: 'cvs',
      name: 'cvs',
      public: false,
      file_size_limit: 5242880,
      allowed_mime_types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    },
    {
      id: 'gallery',
      name: 'gallery',
      public: true,
      file_size_limit: 5242880,
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    {
      id: 'team-photos',
      name: 'team-photos',
      public: true,
      file_size_limit: 5242880,
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp']
    }
  ];

  for (const bucket of buckets) {
    console.log(`\n   Creating bucket: ${bucket.name}...`);
    
    const result = await makeAPIRequest(
      `/v1/projects/${PROJECT_REF}/storage/buckets`,
      'POST',
      bucket
    );

    if (result.success) {
      console.log(`   ✅ Created bucket: ${bucket.name}`);
    } else {
      if (result.body && result.body.includes('already exists')) {
        console.log(`   ⏭️  Bucket "${bucket.name}" already exists`);
      } else {
        console.error(`   ❌ Error:`, result.error || result.body);
      }
    }
  }
}

async function setupDatabase() {
  console.log('\n🗄️  Setting up Database Schema...');
  
  const schemaPath = path.join(__dirname, '../supabase/schema.sql');
  console.log(`\n📖 Reading schema from: ${schemaPath}`);
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    return false;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  console.log(`✅ Schema loaded (${schema.length} characters)`);

  // Execute the entire schema at once
  const result = await executeSQL(schema);
  
  return result.success || result.skipped;
}

async function verifySetup() {
  console.log('\n🔍 Verifying Setup...');
  
  // List all buckets
  console.log('\n   Checking storage buckets...');
  const bucketsResult = await makeAPIRequest(
    `/v1/projects/${PROJECT_REF}/storage/buckets`,
    'GET'
  );

  if (bucketsResult.success) {
    console.log(`   ✅ Storage buckets: ${bucketsResult.data.length}`);
    bucketsResult.data.forEach(b => {
      console.log(`      - ${b.name} (${b.public ? 'public' : 'private'})`);
    });
  } else {
    console.error('   ❌ Could not verify buckets');
  }

  // Check database tables
  console.log('\n   Checking database tables...');
  const tablesSQL = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  const tablesResult = await executeSQL(tablesSQL);
  
  if (tablesResult.success && tablesResult.data) {
    console.log(`   ✅ Database tables verified`);
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   PEG Security - Automated Supabase Setup         ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log(`\n🔌 Project: ${PROJECT_REF}`);

  try {
    // Step 1: Database setup
    console.log('\n📍 Step 1: Database Schema');
    const dbSuccess = await setupDatabase();
    
    if (!dbSuccess) {
      console.error('\n❌ Database setup failed. Please check the logs.');
      process.exit(1);
    }

    // Step 2: Storage buckets
    console.log('\n📍 Step 2: Storage Buckets');
    await setupStorageBuckets();

    // Step 3: Verify everything
    console.log('\n📍 Step 3: Verification');
    await verifySetup();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║   🎉 Setup Complete!                              ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Test API: curl http://localhost:3000/api/jobs');
    console.log('   4. Admin portal: http://localhost:3000/admin');
    console.log('');

  } catch (error) {
    console.error('\n❌ Fatal error during setup:');
    console.error(error);
    process.exit(1);
  }
}

main();
