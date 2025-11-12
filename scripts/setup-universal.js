#!/usr/bin/env node

/**
 * UNIVERSAL SUPABASE PROJECT SETUP
 * 
 * This script can be used for ANY Supabase + Next.js project
 * Just copy this file and your schema.sql to a new project
 * 
 * Features:
 * - Database schema execution
 * - Storage bucket creation
 * - RLS policy setup
 * - Automatic verification
 * - Detailed logging
 * 
 * Usage:
 *   node setup-universal.js
 * 
 * Or with custom config:
 *   node setup-universal.js --schema=./custom-schema.sql --buckets=./buckets.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration (can be overridden via command line args)
const CONFIG = {
  projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1],
  accessToken: process.env.SUPABASE_ACCESS_TOKEN || 'sbp_6596626ef518ed0e896aa4031a560c3dd19d0193',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  schemaPath: path.join(__dirname, '../supabase/schema.sql'),
  bucketsConfig: null // Can load from JSON file if provided
};

// Parse command line arguments
process.argv.forEach(arg => {
  if (arg.startsWith('--schema=')) {
    CONFIG.schemaPath = arg.split('=')[1];
  }
  if (arg.startsWith('--buckets=')) {
    CONFIG.bucketsConfig = JSON.parse(fs.readFileSync(arg.split('=')[1], 'utf8'));
  }
});

// Validate configuration
if (!CONFIG.projectRef || !CONFIG.serviceRoleKey) {
  console.error('\n❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure .env.local exists and contains these values.\n');
  process.exit(1);
}

// Default bucket configuration (if not provided via JSON file)
const DEFAULT_BUCKETS = [
  {
    id: 'uploads',
    name: 'uploads',
    public: false,
    file_size_limit: 10485760, // 10MB
    allowed_mime_types: ['image/*', 'application/pdf']
  }
];

const BUCKETS = CONFIG.bucketsConfig || DEFAULT_BUCKETS;

// API helper
function makeAPIRequest(endpoint, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: jsonBody,
            statusCode: res.statusCode,
            body
          });
        } catch (e) {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            error: body,
            statusCode: res.statusCode,
            body
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Execute SQL
async function executeSQL(sql, description = 'SQL execution') {
  console.log(`\n⚡ ${description}...`);
  
  const result = await makeAPIRequest(
    `/v1/projects/${CONFIG.projectRef}/database/query`,
    'POST',
    { query: sql }
  );

  if (result.success || (result.body && result.body.includes('already exists'))) {
    console.log(`   ✅ Success`);
    return { success: true };
  } else {
    console.error(`   ❌ Error:`, result.error || result.body);
    return { success: false, error: result.error || result.body };
  }
}

// Setup database
async function setupDatabase() {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 DATABASE SETUP');
  console.log('═'.repeat(60));

  if (!fs.existsSync(CONFIG.schemaPath)) {
    console.error(`\n❌ Schema file not found: ${CONFIG.schemaPath}`);
    return false;
  }

  const schema = fs.readFileSync(CONFIG.schemaPath, 'utf8');
  console.log(`\n📖 Schema file: ${CONFIG.schemaPath}`);
  console.log(`   Size: ${(schema.length / 1024).toFixed(2)} KB`);
  console.log(`   Lines: ${schema.split('\n').length}`);

  const result = await executeSQL(schema, 'Executing database schema');
  return result.success;
}

// Setup storage buckets
async function setupStorageBuckets() {
  console.log('\n' + '═'.repeat(60));
  console.log('🪣 STORAGE BUCKETS SETUP');
  console.log('═'.repeat(60));

  console.log(`\n📦 Configuring ${BUCKETS.length} bucket(s)...`);

  for (const bucket of BUCKETS) {
    console.log(`\n   Bucket: ${bucket.name}`);
    console.log(`   - Public: ${bucket.public}`);
    console.log(`   - Max size: ${(bucket.file_size_limit / 1024 / 1024).toFixed(2)} MB`);

    const result = await makeAPIRequest(
      `/v1/projects/${CONFIG.projectRef}/storage/buckets`,
      'POST',
      bucket
    );

    if (result.success) {
      console.log(`   ✅ Created`);
    } else if (result.body && result.body.includes('already exists')) {
      console.log(`   ⏭️  Already exists`);
    } else {
      console.error(`   ❌ Error:`, result.error || result.body);
    }
  }
}

// Verify setup
async function verifySetup() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔍 VERIFICATION');
  console.log('═'.repeat(60));

  // Check buckets
  const bucketsResult = await makeAPIRequest(
    `/v1/projects/${CONFIG.projectRef}/storage/buckets`,
    'GET'
  );

  if (bucketsResult.success) {
    console.log(`\n✅ Storage Buckets: ${bucketsResult.data.length}`);
    bucketsResult.data.forEach(b => {
      console.log(`   - ${b.name} (${b.public ? 'public' : 'private'})`);
    });
  }

  // Check tables
  const tablesSQL = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  const tablesResult = await executeSQL(tablesSQL, 'Checking database tables');
  if (tablesResult.success) {
    console.log(`\n✅ Database tables configured`);
  }
}

// Main execution
async function main() {
  const startTime = Date.now();

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     UNIVERSAL SUPABASE PROJECT SETUP                  ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n📍 Project: ${CONFIG.projectRef}`);
  console.log(`📁 Schema: ${CONFIG.schemaPath}`);
  console.log(`🪣 Buckets: ${BUCKETS.length} configured`);

  try {
    // Step 1: Database
    const dbSuccess = await setupDatabase();
    if (!dbSuccess) {
      throw new Error('Database setup failed');
    }

    // Step 2: Storage
    await setupStorageBuckets();

    // Step 3: Verify
    await verifySetup();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     🎉 SETUP COMPLETE                                 ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n⏱️  Total time: ${duration}s`);
    console.log('\n📋 Next Steps:');
    console.log('   npm run dev                  # Start development server');
    console.log('   npm run build                # Build for production');
    console.log('   npm run lint                 # Check code quality');
    console.log('');

  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════╗');
    console.error('║     ❌ SETUP FAILED                                   ║');
    console.error('╚════════════════════════════════════════════════════════╝');
    console.error('\nError:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check .env.local has correct credentials');
    console.error('  2. Verify project is not paused in Supabase dashboard');
    console.error('  3. Ensure schema.sql file exists and is valid SQL');
    console.error('  4. Check Management API token permissions');
    console.error('');
    process.exit(1);
  }
}

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Setup interrupted by user');
  process.exit(0);
});

// Run
main().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
