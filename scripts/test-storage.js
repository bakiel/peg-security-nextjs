#!/usr/bin/env node

/**
 * Test Storage Buckets
 * Verifies that all storage buckets are working correctly
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testStorage() {
  console.log('🧪 Testing Supabase Storage Buckets\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Test 1: List all buckets
  console.log('📋 Test 1: List Buckets');
  const { data: buckets, error: listError } = await supabase
    .storage
    .listBuckets();

  if (listError) {
    console.log('   ❌ Failed:', listError.message);
  } else {
    console.log(`   ✅ Found ${buckets.length} buckets:`);
    buckets.forEach(bucket => {
      console.log(`      - ${bucket.id} (${bucket.public ? 'Public' : 'Private'})`);
    });
  }

  // Test 2: Check each expected bucket
  console.log('\n📦 Test 2: Verify Expected Buckets');
  const expectedBuckets = ['cvs', 'gallery', 'team-photos'];
  
  for (const bucketId of expectedBuckets) {
    const exists = buckets?.find(b => b.id === bucketId);
    if (exists) {
      console.log(`   ✅ ${bucketId}: EXISTS`);
      
      // Try to list files in bucket
      const { data: files, error: filesError } = await supabase
        .storage
        .from(bucketId)
        .list();

      if (filesError) {
        console.log(`      ⚠️  Cannot list files: ${filesError.message}`);
      } else {
        console.log(`      📄 Files: ${files.length}`);
      }
    } else {
      console.log(`   ❌ ${bucketId}: MISSING`);
    }
  }

  // Test 3: Test upload (if test file exists)
  console.log('\n📤 Test 3: Test Upload (Optional)');
  const testFilePath = path.join(__dirname, '../public/logo.png');
  
  if (fs.existsSync(testFilePath)) {
    console.log('   🎯 Testing upload to gallery bucket...');
    
    const fileBuffer = fs.readFileSync(testFilePath);
    const fileName = `test-${Date.now()}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('gallery')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png'
      });

    if (uploadError) {
      console.log(`   ❌ Upload failed: ${uploadError.message}`);
    } else {
      console.log(`   ✅ Upload successful: ${fileName}`);
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('gallery')
        .getPublicUrl(fileName);
      
      console.log(`   🔗 Public URL: ${publicUrl}`);
      
      // Clean up test file
      await supabase.storage.from('gallery').remove([fileName]);
      console.log(`   🧹 Test file removed`);
    }
  } else {
    console.log('   ⏭️  Skipped (no test file available)');
  }

  console.log('\n✅ Storage tests complete!\n');
  
  // Print URLs
  console.log('📎 Useful Links:\n');
  console.log('   Storage Dashboard:');
  console.log('   https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/buckets\n');
  console.log('   Storage Policies:');
  console.log('   https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/storage/policies\n');
}

testStorage().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
