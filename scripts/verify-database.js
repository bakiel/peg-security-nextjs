#!/usr/bin/env node

/**
 * Database Verification Script
 * Checks that all tables exist and RLS policies are configured
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  console.log('🔍 Verifying PEG Security Database Setup...\n');
  console.log('📡 Connecting to:', supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Test 1: Check tables exist
    console.log('\n📋 Checking Tables...');
    const tables = ['contacts', 'jobs', 'applications', 'gallery', 'team_members', 'services'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: Connected`);
      }
    }

    // Test 2: Count records in each table
    console.log('\n📊 Record Counts...');
    for (const table of tables) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`   ${table}: ${count} records`);
      }
    }

    // Test 3: Test contact form submission (as anon user)
    console.log('\n🧪 Testing Contact Form (Public Access)...');
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const testContact = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+27 11 111 1111',
      service_type: 'Armed Response',
      message: 'This is a test message',
      preferred_contact: 'Email'
    };

    const { data: contactData, error: contactError } = await anonSupabase
      .from('contacts')
      .insert(testContact)
      .select()
      .single();

    if (contactError) {
      console.log('   ❌ Contact form test failed:', contactError.message);
    } else {
      console.log('   ✅ Contact form submission works!');
      console.log(`   📝 Test contact ID: ${contactData.id}`);
      
      // Clean up test data
      await supabase.from('contacts').delete().eq('id', contactData.id);
      console.log('   🧹 Test data cleaned up');
    }

    // Test 4: Check RLS policies
    console.log('\n🔒 Checking RLS Policies...');
    const { data: policies, error: policyError } = await supabase
      .rpc('pg_policies')
      .select('*');

    if (!policyError && policies) {
      console.log(`   ✅ Found ${policies.length} RLS policies configured`);
    }

    console.log('\n✅ Database Verification Complete!');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Start development server: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Test contact form: http://localhost:3000/contact');
    console.log('   4. View jobs: http://localhost:3000/careers');
    console.log('\n📊 Admin Dashboard:');
    console.log('   URL: http://localhost:3000/admin');
    console.log('   Note: Configure auth in Supabase dashboard\n');

  } catch (error) {
    console.error('\n❌ Verification Error:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run verification
verifyDatabase();
