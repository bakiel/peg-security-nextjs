/**
 * PostgreSQL Database Client for VPS
 * Replaces Supabase client with direct PostgreSQL connection
 */

import { Pool, PoolClient, QueryResult } from 'pg'

// Create connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'peg_security',
  user: process.env.POSTGRES_USER || 'peg_security',
  password: process.env.POSTGRES_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Handle pool errors
pool.on('error', (err) => {
  console.error('[DB POOL ERROR]', err)
})

/**
 * Execute a SQL query
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now()
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    console.log('[DB QUERY]', { text, duration, rows: result.rowCount })
    return result
  } catch (error) {
    console.error('[DB QUERY ERROR]', { text, error })
    throw error
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect()
  return client
}

/**
 * Supabase-compatible query builder for easier migration
 * Usage: db.from('table_name').select('*').eq('id', '123')
 */
export const db = {
  from(table: string) {
    let selectClause = '*'
    let whereClause = ''
    let orderClause = ''
    let limitClause = ''
    const params: any[] = []

    const builder = {
      select(columns: string = '*') {
        selectClause = columns
        return builder
      },

      eq(column: string, value: any) {
        params.push(value)
        const condition = `${column} = $${params.length}`
        whereClause = whereClause ? `${whereClause} AND ${condition}` : condition
        return builder
      },

      neq(column: string, value: any) {
        params.push(value)
        const condition = `${column} != $${params.length}`
        whereClause = whereClause ? `${whereClause} AND ${condition}` : condition
        return builder
      },

      like(column: string, value: string) {
        params.push(value)
        const condition = `${column} LIKE $${params.length}`
        whereClause = whereClause ? `${whereClause} AND ${condition}` : condition
        return builder
      },

      in(column: string, values: any[]) {
        const placeholders = values.map((_, i) => {
          params.push(values[i])
          return `$${params.length}`
        }).join(', ')
        const condition = `${column} IN (${placeholders})`
        whereClause = whereClause ? `${whereClause} AND ${condition}` : condition
        return builder
      },

      order(column: string, options?: { ascending?: boolean }) {
        const direction = options?.ascending === false ? 'DESC' : 'ASC'
        orderClause = `ORDER BY ${column} ${direction}`
        return builder
      },

      limit(count: number) {
        limitClause = `LIMIT ${count}`
        return builder
      },

      async execute<T = any>(): Promise<{ data: T[] | null; error: any }> {
        try {
          const whereSQL = whereClause ? `WHERE ${whereClause}` : ''
          const sql = `SELECT ${selectClause} FROM ${table} ${whereSQL} ${orderClause} ${limitClause}`.trim()
          const result = await query<T>(sql, params)
          return { data: result.rows, error: null }
        } catch (error) {
          console.error('[DB EXECUTE ERROR]', error)
          return { data: null, error }
        }
      },

      async insert(data: any): Promise<{ data: any | null; error: any }> {
        try {
          const columns = Object.keys(data)
          const values = Object.values(data)
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
          const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`
          const result = await query(sql, values)
          return { data: result.rows[0], error: null }
        } catch (error) {
          console.error('[DB INSERT ERROR]', error)
          return { data: null, error }
        }
      },

      async update(data: any): Promise<{ data: any | null; error: any }> {
        try {
          const updates: string[] = []
          const values: any[] = []

          Object.entries(data).forEach(([key, value]) => {
            values.push(value)
            updates.push(`${key} = $${values.length}`)
          })

          // Add WHERE params
          const whereParams = [...values, ...params]
          const whereParamStart = values.length + 1
          const adjustedWhereClause = whereClause
            .split('$')
            .map((part, i) => i === 0 ? part : `$${whereParamStart + parseInt(part) - 1}${part.slice(part.indexOf(' '))}`)
            .join('')

          const whereSQL = adjustedWhereClause ? `WHERE ${adjustedWhereClause}` : ''
          const sql = `UPDATE ${table} SET ${updates.join(', ')} ${whereSQL} RETURNING *`
          const result = await query(sql, whereParams)
          return { data: result.rows[0], error: null }
        } catch (error) {
          console.error('[DB UPDATE ERROR]', error)
          return { data: null, error }
        }
      },

      async delete(): Promise<{ data: any | null; error: any }> {
        try {
          const whereSQL = whereClause ? `WHERE ${whereClause}` : ''
          const sql = `DELETE FROM ${table} ${whereSQL} RETURNING *`
          const result = await query(sql, params)
          return { data: result.rows, error: null }
        } catch (error) {
          console.error('[DB DELETE ERROR]', error)
          return { data: null, error }
        }
      },
    }

    return builder
  },
}

/**
 * Close the pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  await pool.end()
}

/**
 * Database Types (keep same as Supabase types)
 */

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  service_type: string
  message: string
  preferred_contact: 'Email' | 'Phone'
  status: 'New' | 'Read' | 'Responded'
  notes?: string
  submitted_at: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  slug: string
  category: string
  location: string
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary'
  psira_required: boolean
  description: string
  responsibilities: string
  requirements: string
  benefits?: string
  status: 'Draft' | 'Open' | 'Closed'
  application_count: number
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  job_title: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  cv_url: string
  cv_public_id: string
  cover_letter: string
  psira_registered: boolean
  psira_number?: string
  years_experience: number
  status: 'New' | 'Reviewing' | 'Interviewed' | 'Hired' | 'Rejected'
  notes?: string
  submitted_at: string
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  image_public_id: string
  thumbnail_url: string
  status: 'Active' | 'Hidden'
  display_order: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  photo_url: string
  photo_public_id: string
  email?: string
  phone?: string
  linkedin_url?: string
  display_order: number
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon_name: string
  category: string
  features: string[]
  pricing_model: string
  pricing_details?: string
  image_url?: string
  image_public_id?: string
  display_order: number
  status: 'Active' | 'Draft' | 'Archived'
  created_at: string
  updated_at: string
}
