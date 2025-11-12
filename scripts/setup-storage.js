#!/usr/bin/env node

/**
 * Supabase Storage Bucket Setup Script
 * Automatically creates and configures storage buckets for PEG Security
 * 
 * This script can be run via MCP or directly from command line
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Bucket configurations
const BUCKETS = [
  {
    id: 'cvs',
    name: 'cvs',
    public: false,
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    fileSizeLimit: 5242880, // 5MB
    description: 'Job application CVs and resumes'
  },
  {
    id: 'gallery',
    name: 'gallery',
    public: true,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ],
    fileSizeLimit: 10485760, // 10MB
    description: 'Public gallery images for security services showcase'
  },
  {
    id: 'team-photos',
    name: 'team-photos',
    public: true,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp'
    ],
    fileSizeLimit: 5242880, // 5MB
    description: 'Team member profile photos'
  }
];

// Storage policies for each bucket
const POLICIES = {
  cvs: [
    {
      name: 'Anyone can upload CVs',
      definition: 'CREATE POLICY "Anyone can upload CVs" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = \'cvs\');'
    },
    {
      name: 'Service role can read all CVs',
      definition: 'CREATE POLICY "Service role can read all CVs" ON storage.objects FOR SELECT USING (bucket_id = \'cvs\' AND auth.jwt()->\'role\' = \'service_role\');'
    },
    {
      name: 'Service role can delete CVs',
      definition: 'CREATE POLICY "Service role can delete CVs" ON storage.objects FOR DELETE USING (bucket_id = \'cvs\' AND auth.jwt()->\'role\' = \'service_role\');'
    }
  ],
  gallery: [
    {
      name: 'Public can view gallery images',
      definition: 'CREATE POLICY "Public can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = \'gallery\');'
    },
    {
      name: 'Service role can upload gallery images',
      definition: 'CREATE POLICY "Service role can upload gallery images" ON storage.objects FOR INSERT TO service_role WITH CHECK (bucket_id = \'gallery\');'
    },
    {
      name: 'Service role can update gallery images',
      definition: 'CREATE POLICY "Service role can update gallery images" ON storage.objects FOR UPDATE TO service_role USING (bucket_id = \'gallery\');'
    },
    {
      name: 'Service role can delete gallery images',
      definition: 'CREATE POLICY "Service role can delete gallery images" ON storage.objects FOR DELETE TO service_role USING (bucket_id = \'gallery\');'
    }
  ],
  'team-photos': [
    {
      name: 'Public can view team photos',
      definition: 'CREATE POLICY "Public can view team photos" ON storage.objects FOR SELECT USING (bucket_id = \'team-photos\');'
    },
    {
      name: 'Service role can manage team photos',
      definition: 'CREATE POLICY "Service role can manage team photos" ON storage.objects FOR ALL TO service_role USING (bucket_id = \'team-photos\');'
    }
  ]
};

async function createBuckets() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  console.log('🪣 Setting up Supabase Storage Buckets...\n');
  console.log('📡 Connecting to:', supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Create buckets
  for (const bucket of BUCKETS) {
    console.log(`\n📦 Creating bucket: ${bucket.name}`);
    console.log(`   Description: ${bucket.description}`);
    console.log(`   Public: ${bucket.public}`);
    console.log(`   Size Limit: ${(bucket.fileSizeLimit / 1024 / 1024).toFixed(1)}MB`);

    try {
      const { data, error } = await supabase
        .storage
        .createBucket(bucket.id, {
          public: bucket.public,
          allowedMimeTypes: bucket.allowedMimeTypes,
          fileSizeLimit: bucket.fileSizeLimit
        });

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ⏭️  Bucket already exists: ${bucket.name}`);
          skipCount++;
        } else {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
        }
      } else {
        console.log(`   ✅ Created successfully!`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exception: ${err.message}`);
      errorCount++;
    }
  }

  // List all buckets
  console.log('\n📋 Verifying buckets...');
  const { data: buckets, error: listError } = await supabase
    .storage
    .listBuckets();

  if (listError) {
    console.error('❌ Could not list buckets:', listError.message);
  } else {
    console.log(`\n✅ Total buckets: ${buckets.length}\n`);
    buckets.forEach((bucket, index) => {
      const isOurs = BUCKETS.find(b => b.id === bucket.id);
      const icon = isOurs ? '🆕' : '📦';
      console.log(`   ${icon} ${bucket.id} (${bucket.public ? 'Public' : 'Private'})`);
    });
  }

  // Summary
  console.log('\n📊 Bucket Creation Summary:');
  console.log(`   ✅ Created: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);

  // Storage policies info
  console.log('\n🔒 Storage Policies:');
  console.log('\n⚠️  Note: Storage policies must be created via SQL Editor.');
  console.log('   Copy the SQL from this script output and run it in:');
  console.log('   https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new\n');

  // Generate SQL for policies
  console.log('-- Storage Policies SQL\n');
  for (const [bucketId, policies] of Object.entries(POLICIES)) {
    console.log(`-- Policies for bucket: ${bucketId}`);
    for (const policy of policies) {
      console.log(policy.definition);
    }
    console.log('');
  }

  console.log('\n🎉 Storage bucket setup complete!');
  console.log('\nNext steps:');
  console.log('  1. Copy the SQL above');
  console.log('  2. Run it in Supabase SQL Editor');
  console.log('  3. Test file uploads in your application\n');
}

// Run the setup
createBuckets().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
