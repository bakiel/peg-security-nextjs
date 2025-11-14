import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('Connecting to:', supabaseUrl)

  const { data, error, count } = await supabase
    .from('jobs')
    .select('id, title, category, status', { count: 'exact' })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`\nFound ${count} total jobs:`)
  data?.forEach((job: any) => {
    console.log(`  - ${job.title} (${job.category}) [${job.status}]`)
  })
}

checkDatabase()
