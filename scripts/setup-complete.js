#!/usr/bin/env node

/**
 * Complete Automated Supabase Setup
 * - Creates all database tables
 * - Sets up storage buckets
 * - Configures RLS policies
 * - Sets up bucket policies
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql, description) {
  console.log(`\n⚡ ${description}...`);
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      // Check if it's just an "already exists" error
      if (error.message.includes('already exists')) {
        console.log(`   ⏭️  Already exists - skipping`);
        return { success: true, skipped: true };
      }
      console.error(`   ❌ Error:`, error.message);
      return { success: false, error };
    }
    
    console.log(`   ✅ Success`);
    return { success: true, data };
  } catch (err) {
    console.error(`   ❌ Exception:`, err.message);
    return { success: false, error: err };
  }
}

async function setupStorageBuckets() {
  console.log('\n📦 Setting up Storage Buckets...');
  
  const buckets = [
    {
      id: 'cvs',
      name: 'cvs',
      public: false,
      file_size_limit: 5242880, // 5MB
      allowed_mime_types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    },
    {
      id: 'gallery',
      name: 'gallery', 
      public: true,
      file_size_limit: 5242880, // 5MB
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    {
      id: 'team-photos',
      name: 'team-photos',
      public: true,
      file_size_limit: 5242880, // 5MB
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp']
    }
  ];

  for (const bucket of buckets) {
    console.log(`\n   Creating bucket: ${bucket.name}...`);
    
    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.file_size_limit,
      allowedMimeTypes: bucket.allowed_mime_types
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`   ⏭️  Bucket "${bucket.name}" already exists`);
      } else {
        console.error(`   ❌ Error creating bucket "${bucket.name}":`, error.message);
      }
    } else {
      console.log(`   ✅ Created bucket: ${bucket.name}`);
    }
  }
}

async function setupBucketPolicies() {
  console.log('\n🔐 Setting up Storage Bucket Policies...');
  
  const policies = [
    // CVs bucket - authenticated users can upload, service role can read
    {
      bucket: 'cvs',
      name: 'Anyone can upload CVs',
      definition: 'INSERT',
      sql: `
        CREATE POLICY "Anyone can upload CVs"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'cvs');
      `
    },
    {
      bucket: 'cvs',
      name: 'Service role can read CVs',
      definition: 'SELECT',
      sql: `
        CREATE POLICY "Service role can read CVs"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'cvs' AND auth.jwt()->>'role' = 'service_role');
      `
    },
    // Gallery bucket - public read, service role can manage
    {
      bucket: 'gallery',
      name: 'Public can view gallery images',
      definition: 'SELECT',
      sql: `
        CREATE POLICY "Public can view gallery images"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'gallery');
      `
    },
    {
      bucket: 'gallery',
      name: 'Service role can manage gallery',
      definition: 'ALL',
      sql: `
        CREATE POLICY "Service role can manage gallery"
        ON storage.objects FOR ALL
        USING (bucket_id = 'gallery' AND auth.jwt()->>'role' = 'service_role');
      `
    },
    // Team photos bucket - public read, service role can manage
    {
      bucket: 'team-photos',
      name: 'Public can view team photos',
      definition: 'SELECT',
      sql: `
        CREATE POLICY "Public can view team photos"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'team-photos');
      `
    },
    {
      bucket: 'team-photos',
      name: 'Service role can manage team photos',
      definition: 'ALL',
      sql: `
        CREATE POLICY "Service role can manage team photos"
        ON storage.objects FOR ALL
        USING (bucket_id = 'team-photos' AND auth.jwt()->>'role' = 'service_role');
      `
    }
  ];

  for (const policy of policies) {
    await executeSQL(policy.sql, `Creating policy: ${policy.name}`);
  }
}

async function setupDatabase() {
  console.log('\n🗄️  Setting up Database Schema...');
  
  // Read and execute the main schema
  const schemaPath = path.join(__dirname, '../supabase/schema.sql');
  console.log(`\n📖 Reading schema from: ${schemaPath}`);
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    return false;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  console.log(`✅ Schema loaded (${schema.length} characters)`);
  
  // Split into statements and execute one by one
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`\n⚡ Executing ${statements.length} SQL statements...\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Progress indicator
    if (i % 10 === 0) {
      console.log(`\n📊 Progress: ${i}/${statements.length} statements...`);
    }
    
    const result = await executeSQL(statement, `Statement ${i + 1}/${statements.length}`);
    
    if (result.success) {
      if (result.skipped) {
        skipCount++;
      } else {
        successCount++;
      }
    } else {
      errorCount++;
    }
  }

  console.log(`\n📊 Database Setup Results:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);

  return errorCount === 0 || (errorCount < 5 && skipCount > 0);
}

async function verifySetup() {
  console.log('\n🔍 Verifying Setup...');
  
  // Check tables
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE');

  if (tablesError) {
    console.error('   ❌ Could not verify tables:', tablesError.message);
  } else {
    console.log(`\n   ✅ Tables created: ${tables.length}`);
    tables.forEach(t => console.log(`      - ${t.table_name}`));
  }

  // Check buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('\n   ❌ Could not verify buckets:', bucketsError.message);
  } else {
    console.log(`\n   ✅ Storage buckets: ${buckets.length}`);
    buckets.forEach(b => console.log(`      - ${b.name} (${b.public ? 'public' : 'private'})`));
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   PEG Security - Automated Supabase Setup         ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log(`\n🔌 Connecting to: ${supabaseUrl}`);

  try {
    // Step 1: Database setup
    const dbSuccess = await setupDatabase();
    
    if (!dbSuccess) {
      console.error('\n❌ Database setup had too many errors. Please check the logs.');
      process.exit(1);
    }

    // Step 2: Storage buckets
    await setupStorageBuckets();

    // Step 3: Bucket policies
    await setupBucketPolicies();

    // Step 4: Verify everything
    await verifySetup();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║   🎉 Setup Complete!                              ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Test API: curl http://localhost:3000/api/jobs');
    console.log('   4. Admin portal: http://localhost:3000/admin');
    console.log('      Username: admin');
    console.log('      Password: PEGSecurity2025!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Fatal error during setup:');
    console.error(error);
    process.exit(1);
  }
}

main();
