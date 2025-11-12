const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAPI() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('🧪 Testing API endpoints...\n');

  // Test 1: Fetch jobs
  console.log('1️⃣ Testing GET /api/jobs (public jobs)');
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'Open');
  
  if (jobsError) {
    console.log('   ❌ Error:', jobsError.message);
  } else {
    console.log(`   ✅ Success! Found ${jobs.length} open jobs`);
    if (jobs.length > 0) {
      console.log(`   📄 Sample: "${jobs[0].title}" in ${jobs[0].location}`);
    }
  }

  // Test 2: Fetch gallery
  console.log('\n2️⃣ Testing GET /api/gallery (public images)');
  const { data: gallery, error: galleryError } = await supabase
    .from('gallery')
    .select('*')
    .eq('status', 'Active');
  
  if (galleryError) {
    console.log('   ❌ Error:', galleryError.message);
  } else {
    console.log(`   ✅ Success! Found ${gallery.length} active images`);
    if (gallery.length > 0) {
      console.log(`   🖼️  Sample: "${gallery[0].title}" - ${gallery[0].category}`);
    }
  }

  // Test 3: Submit contact form
  console.log('\n3️⃣ Testing POST /api/contact (submit form)');
  const testContact = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+27 11 111 1111',
    service_type: 'Armed Response',
    message: 'This is a test submission from the API test script.',
    preferred_contact: 'Email'
  };
  
  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .insert(testContact)
    .select()
    .single();
  
  if (contactError) {
    console.log('   ❌ Error:', contactError.message);
  } else {
    console.log('   ✅ Success! Contact submitted');
    console.log(`   📝 Contact ID: ${contact.id}`);
  }

  console.log('\n🎉 API tests complete!\n');
  console.log('Next steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Visit: http://localhost:3000');
  console.log('  3. Admin panel: http://localhost:3000/admin');
}

testAPI();
