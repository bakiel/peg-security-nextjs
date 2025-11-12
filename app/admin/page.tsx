import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

/**
 * Admin Root Page
 * Redirects to dashboard if authenticated, login if not
 */
export default async function AdminPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  // If session exists, redirect to dashboard
  if (sessionCookie?.value) {
    redirect('/admin/dashboard')
  }

  // Otherwise redirect to login
  redirect('/admin/login')
}
