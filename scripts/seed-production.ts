import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Get production Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'NOT SET')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedJobs() {
  console.log('🌱 Seeding production database with jobs...')

  // Read jobs data
  const jobsData = JSON.parse(
    fs.readFileSync('/tmp/jobs_seed.json', 'utf-8')
  )

  console.log(`Found ${jobsData.length} jobs to seed`)

  // Check if jobs already exist
  const { data: existingJobs, error: checkError } = await supabase
    .from('jobs')
    .select('id')

  if (checkError) {
    console.error('Error checking existing jobs:', checkError)
    process.exit(1)
  }

  if (existingJobs && existingJobs.length > 0) {
    console.log(`⚠️  Database already has ${existingJobs.length} jobs`)
    console.log('Skipping seed to avoid duplicates')
    return
  }

  // Insert jobs
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobsData)
    .select()

  if (error) {
    console.error('❌ Error seeding jobs:', error)
    process.exit(1)
  }

  console.log(`✅ Successfully seeded ${data?.length} jobs!`)

  // List the seeded jobs
  data?.forEach((job: any) => {
    console.log(`  - ${job.title} (${job.category})`)
  })
}

async function main() {
  try {
    await seedJobs()
    console.log('\n🎉 Seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
